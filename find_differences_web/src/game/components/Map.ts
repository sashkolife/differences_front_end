import * as PIXI from 'pixi.js';
import CContainer from "../../components/CContainer";
import CSprite from "../../components/CSprite";
import CFactory from "../../components/CFactory";
import * as constants from "../../constants/constants";
import MapLocation from "./MapLocation";
import MapLevelTooltip from "./MapLevelTooltip";
import MapClouds from "./MapClouds";
import MapLevel from "./MapLevel";
import User from "../../data/User";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import Levels from "../../data/Levels";
import WindowsController from "../windows/WindowsController";
import LevelStartWindow from "../windows/LevelStartWindow";
import {MapModel} from "../../models/PropertiesModels";

export default class Map extends CContainer {

    private _tooltip: MapLevelTooltip;
    private _clouds: MapClouds;
    private _locations: Array<MapLocation>;

    private _currentLevel:MapLevel = null;

    private _currentLocationId:number = 0;
    private _nextLocationId:number = 0;

    private _mapScale:number = 1;

    private _isDrag:boolean = false;
    private _prevPoint:any = {x:0,y:0};
    private _screenRect:PIXI.Rectangle = new PIXI.Rectangle(0,0,(window as any).APP_WIDTH,(window as any).APP_HEIGHT);
    private _dragMin:number = (window as any).APP_HEIGHT;
    private _dragMax:number = 0;
    private _locationHeight:number = 0;
    private _locationWidth:number = 0;

    private _levelOverSubscription:any = null;
    private _levelOutSubscription:any = null;
    private _levelClickSubscription:any = null;

    constructor( props: MapModel ) {
        super( props );

        this._tooltip = this.getComponentByName("tooltip");
        this._locations = this.getComponentsByType( constants.COMPONENT_LOCATION );
        this._clouds = this.getComponentByName("clouds");

        this._mapScale = (window as any).APP_WIDTH/2048;

        this._locationHeight = props.locationHeight;
        this._locationWidth = props.locationWidth;

        this.scale.set(this._mapScale, this._mapScale);
        this._tooltip.scale.set(1/this._mapScale);

        const self: any = this;
        self.interactive = true;
        self.on("mouseover", this.onOver.bind(this));
        self.on("mousedown", this.onStart.bind(this));
        self.on("mouseup", this.onEnd.bind(this));
        self.on("mouseupoutside", this.onEndOutside.bind(this));
        self.on("mousemove", this.onMove.bind(this));
        self.on("touchstart", this.onStart.bind(this));
        self.on("touchend", this.onEnd.bind(this));
        self.on("touchendoutside", this.onEndOutside.bind(this));
        self.on("touchmove", this.onMove.bind(this));
        self.on("wheel", this.onWheel.bind(this));

        this._levelOverSubscription = EventBus.subscribe(events.EVENT_ON_MAP_LEVEL_OVER, this.onMapLevelOver.bind(this));
        this._levelOutSubscription = EventBus.subscribe(events.EVENT_ON_MAP_LEVEL_OUT, this.onMapLevelOut.bind(this));
        this._levelClickSubscription = EventBus.subscribe(events.EVENT_ON_MAP_LEVEL_CLICK, this.onMapLevelClick.bind(this));
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this._levelOverSubscription.unsubscribe();
        this._levelOutSubscription.unsubscribe();
        this._levelClickSubscription.unsubscribe();
        super.destroy(_options);
    }

    getNewComponentByType( props:any ) : any {
        const component: any = CFactory.getNewComponent( props );
        if ( !component ) {
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_LOCATION ) {
                return new MapLocation( props );
            }
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_MAP_LEVEL_TOOLTIP ) {
                return new MapLevelTooltip( props );
            }
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_MAP_CLOUDS ) {
                return new MapClouds( props );
            }
        }
    }

    onStart(e:any): void {
        this._isDrag = true;
        this._prevPoint.x = e.global.x;
        this._prevPoint.y = e.global.y;
    }

    onEnd(e:any): void {
        this._isDrag = false;
    }

    onEndOutside(e:any): void {
        this._isDrag = false;
    }

    onMove(e:any): void {

        if ( this._isDrag ) {

            let newY:number = this.y + (e.global.y-this._prevPoint.y);

            if ( newY < this._dragMin ) {
                newY = this._dragMin;
            } else if ( newY > this._dragMax ) {
                newY = this._dragMax;
            }

            this.y = newY;

            this._prevPoint.x = e.global.x;
            this._prevPoint.y = e.global.y;

            this.updateVisibleLocations();
        }

    }

    onWheel(e:any):void {
        let newY:number = this.y - e.deltaY;

        if ( newY < this._dragMin ) {
            newY = this._dragMin;
        } else if ( newY > this._dragMax ) {
            newY = this._dragMax;
        }

        this.y = newY;

        this.updateVisibleLocations();
    }

    onOver(e:any): void {

    }

    private updateVisibleLocations() : void {
        for ( let i:number = 0; i < this._locations.length; i++) {
            const location:MapLocation = this._locations[i];
            const bottomPos:PIXI.Point = new PIXI.Point(location.x+this._locationWidth, location.y+this._locationHeight);
            const globTopPos:PIXI.Point = this.toGlobal( location.position );
            const globBottomPos:PIXI.Point = this.toGlobal( bottomPos );

            const globalRect:PIXI.Rectangle = new PIXI.Rectangle(
                globTopPos.x,
                globTopPos.y,
                globBottomPos.x - globTopPos.x,
                globBottomPos.y - globTopPos.y);

            location.visible = this._screenRect.intersects(globalRect);

            if ( location.visible ) {
                location.load();
            } else {
                location.stop();
            }
        }
    }

    initMap() : void {

        const userLevel:number = User.level;

        let i: number = 0;

        while ( i < this._locations.length && !this._currentLevel ) {
            const mapLevels: Array<MapLevel> = this._locations[i].getMapLevels();
            for (let j: number = 0; j < mapLevels.length; j++) {
                const mapLevel: MapLevel = mapLevels[j];
                const levelId:number = mapLevel.getId();
                mapLevel.setLevelData( Levels.getLevelByID( levelId ) );
                mapLevel.setUserLevelData( User.getUserLevelByID( levelId ) );
                if (mapLevel.getId() < userLevel) {
                    mapLevel.setAvailability(true);
                } else if (mapLevel.getId() == userLevel) {
                    mapLevel.setAvailability(true);
                    mapLevel.setActive(true);
                    this._locations[i].setMarkerToLevel(mapLevel);
                    this._currentLevel = mapLevel;
                    this._currentLocationId = i;
                    break;
                }
            }
            i++
        }

        this.setMaxDrag();

        this.setFences();

        this.scrollMapToCurrentLevel();

        this.showTooltipOnLevel(this._currentLevel);

        this.addClouds();

        this.updateVisibleLocations();
    }

    setMaxDrag() : void {
        this._nextLocationId = this._currentLocationId+1;
        if ( this._nextLocationId >= this._locations.length ) {
            this._nextLocationId = this._currentLocationId;
        }
        let maxLocation:MapLocation = this._locations[this._nextLocationId];
        this._dragMax = Math.abs(maxLocation.y*this._mapScale );
    }

    scrollMapToCurrentLevel() : void {
        const currentLevelGL : PIXI.Point = this._currentLevel.toGlobal({"x":0,"y":0});
        const currentLevelMapLoc : PIXI.Point = (this as any).toLocal(currentLevelGL);

        let newY:number = Math.abs(currentLevelMapLoc.y*this._mapScale)+(this._screenRect.height>>1);

        if ( newY < this._dragMin ) {
            newY = this._dragMin;
        } else if ( newY > this._dragMax ) {
            newY = this._dragMax;
        }

        this.y = newY;

    }

    setFences() {
        for ( let i = 0; i < this._currentLocationId; i++ ) {
            this._locations[i].getFence().setOpened();
        }
        this._locations[this._currentLocationId].getFence().setActive();
    }

    showTooltipOnLevel( mapLevel:MapLevel ) {

        const currentLevelGL : PIXI.Point = mapLevel.toGlobal({"x":0,"y":0});
        const currentLevelMapLoc : PIXI.Point = (this as any).toLocal(currentLevelGL);
        this._tooltip.x = currentLevelMapLoc.x;
        this._tooltip.y = currentLevelMapLoc.y + this._tooltip.properties.y;
        this._tooltip.show(mapLevel.getLevelData());
    }

    addClouds() : void {
        if ( this._nextLocationId > this._currentLocationId ) {
            this._clouds.visible = true;
            this._clouds.y = this._locations[this._nextLocationId].y;
        }
    }

    onMapLevelOver(mapLevel:MapLevel):void {
        this.showTooltipOnLevel(mapLevel);
    }

    onMapLevelOut(mapLevel:MapLevel):void {
        this._tooltip.hide();
    }

    onMapLevelClick( mapLevel:MapLevel ): void {
        WindowsController.instance().show(LevelStartWindow, {"levelData": mapLevel.getLevelData(), "userLevelData": mapLevel.getUserLevelData()});
    }
}
