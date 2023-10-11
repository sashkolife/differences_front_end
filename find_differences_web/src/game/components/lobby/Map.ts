import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../../components/CContainer";
import CFactory from "../../../components/CFactory";
import * as constants from "../../../constants/constants";
import MapLocation from "./MapLocation";
import MapLevelTooltip from "./MapLevelTooltip";
import MapClouds from "./MapClouds";
import MapLevel from "./MapLevel";
import User from "../../../data/User";
import EventBus, {EventModel} from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import Levels from "../../../data/Levels";
import WindowsController from "../../windows/WindowsController";
import LevelStartWindow from "../../windows/LevelStartWindow";
import {MapModel} from "../../../models/PropertiesModels";
import {LevelModel, LocationModel, UserLevelModel} from "../../../models/ApiModels";
import Locations from "../../../data/Locations";
import CSprite from "../../../components/CSprite";
import CBase from "../../../components/CBase";
import Fence from "./Fence";

export default class Map extends CContainer {

    private _tooltip: MapLevelTooltip;
    private _arrow: CSprite;
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

    private _levelOverSubscription:EventModel = null;
    private _levelOutSubscription:EventModel = null;
    private _levelClickSubscription:EventModel = null;

    constructor( props: MapModel ) {
        super( props );

        this._tooltip = this.getComponentByName("tooltip");
        this._arrow = this.getComponentByName("arrow");
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
        gsap.killTweensOf(this._arrow);
        this._levelOverSubscription.unsubscribe();
        this._levelOutSubscription.unsubscribe();
        this._levelClickSubscription.unsubscribe();
        super.destroy(_options);
    }

    public getNewComponentByType( props:any ) : any {
        let component: any = CFactory.getNewComponent( props );
        if ( !component ) {
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_LOCATION ) {
                component = new MapLocation( props );
            }
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_MAP_LEVEL_TOOLTIP ) {
                component = new MapLevelTooltip( props );
            }
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_MAP_CLOUDS ) {
                component = new MapClouds( props );
            }
        }
        return component;
    }

    private onStart(e:any): void {
        this._isDrag = true;
        this._prevPoint.x = e.global.x;
        this._prevPoint.y = e.global.y;
    }

    private onEnd(e:any): void {
        this._isDrag = false;
    }

    private onEndOutside(e:any): void {
        this._isDrag = false;
    }

    private onMove(e:any): void {

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

    private onWheel(e:any):void {
        let newY:number = this.y - e.deltaY;

        if ( newY < this._dragMin ) {
            newY = this._dragMin;
        } else if ( newY > this._dragMax ) {
            newY = this._dragMax;
        }

        this.y = newY;

        this.updateVisibleLocations();
    }

    private onOver(e:any): void {

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

    public initMap() : void {

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
                    this.showArrow(mapLevel);
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

    private setMaxDrag() : void {
        this._nextLocationId = this._currentLocationId+1;
        if ( this._nextLocationId >= this._locations.length ) {
            this._nextLocationId = this._currentLocationId;
        }
        let maxLocation:MapLocation = this._locations[this._nextLocationId];
        this._dragMax = Math.abs(maxLocation.y*this._mapScale );
    }

    private scrollMapToCurrentLevel() : void {
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

    private setFences() {
        for ( let i = 0; i < this._currentLocationId; i++ ) {
            this._locations[i].getFence().setOpened();
        }
        this._locations[this._currentLocationId].getFence().setActive();
    }

    private showTooltipOnLevel( mapLevel:MapLevel ) {

        const currentLevelGL : PIXI.Point = mapLevel.toGlobal({"x":0,"y":0});
        const currentLevelMapLoc : PIXI.Point = (this as any).toLocal(currentLevelGL);
        this._tooltip.x = currentLevelMapLoc.x;
        this._tooltip.y = currentLevelMapLoc.y + this._tooltip.properties.y;
        this._tooltip.show(mapLevel.getLevelData());
    }

    private addClouds() : void {
        if ( this._nextLocationId > this._currentLocationId ) {
            this._clouds.visible = true;
            this._clouds.y = this._locations[this._nextLocationId].y;
        }
    }

    private onMapLevelOver(mapLevel:MapLevel):void {
        this.showTooltipOnLevel(mapLevel);
    }

    private onMapLevelOut(mapLevel:MapLevel):void {
        this._tooltip.hide();
    }

    private onMapLevelClick( mapLevel:MapLevel ): void {
        WindowsController.instance().show(LevelStartWindow, {"levelData": mapLevel.getLevelData(), "userLevelData": mapLevel.getUserLevelData()});
    }

    private getMapLevelById(levelId: number): MapLevel {
        for ( let i = 0; i < this._locations.length; i++ ) {
            const mapLevel: MapLevel = this._locations[i].getMapLevelById(levelId);
            if ( mapLevel ) {
                return mapLevel;
            }
        }
        return null;
    }

    public setNewLevelsStars(levelsToUpdate: UserLevelModel[]) : void {
        levelsToUpdate.forEach( (uLevel: UserLevelModel) => {
           const mapLevel: MapLevel = this.getMapLevelById( uLevel.levelId );
           if ( mapLevel ) {
               mapLevel.setNewStars();
           }
        });
    }

    public scrollMapToFence(callback: Function) : void {
        const keyImg:CSprite = this.getCurrentKeyImg();
        const keyGL : PIXI.Point = keyImg.toGlobal({"x":0,"y":0});
        const keyLoc : PIXI.Point = (this as any).toLocal(keyGL);

        let newY:number = Math.abs(keyLoc.y*this._mapScale)+(this._screenRect.height>>1);

        if ( newY < this._dragMin ) {
            newY = this._dragMin;
        } else if ( newY > this._dragMax ) {
            newY = this._dragMax;
        }

        gsap.to(this, {duration: 0.5, "y": newY, onComplete: () => callback()});

    }

    public getCurrentKeyImg(): CSprite {
        return this._locations[this._currentLocationId].getFence().getKey();
    }

    public moveKeyToFence(keyProgressImg: CSprite, callback: Function): void {
        const keyParent: PIXI.Container = keyProgressImg.parent as PIXI.Container;

        const keyImg:CSprite = this.getCurrentKeyImg();
        const keyGL : PIXI.Point = keyImg.toGlobal({"x":0,"y":0});
        const keyLoc : PIXI.Point = keyParent.toLocal(keyGL);

        const frmAngle: number = keyProgressImg.angle;
        const frmX: number = keyProgressImg.x;
        const frmY: number = keyProgressImg.y;

        const toAngle: number = keyImg.angle;
        const toX: number = keyLoc.x;
        const toY: number = keyLoc.y;

        const tl = gsap.timeline({onComplete: () => {
                keyImg.visible = true;
                keyProgressImg.visible = false;
                keyProgressImg.angle = frmAngle;
                keyProgressImg.x = frmX;
                keyProgressImg.y = frmY;
                callback();
            }
        });
        tl.to(keyProgressImg, { duration: 0.8, ease: "power2.inOut", angle: toAngle, x: toX, y: toY });
    }

    public showArrow(obj: PIXI.DisplayObject): void {
        this._arrow.visible = true;
        gsap.killTweensOf(this._arrow.position);
        const gl: PIXI.Point = obj.toGlobal(new PIXI.Point(0,0));
        const loc: PIXI.Point = this.toLocal(gl);
        this._arrow.x = loc.x;
        this._arrow.y = loc.y + this._arrow.properties.y;
        gsap.to( this._arrow.position, { duration:0.5, "y": "+=10", yoyo: true, repeat: -1 } );
    }

    public setActiveFence(starsCount: number): void {
        const fence: Fence = this._locations[this._currentLocationId].getFence();
        fence.setStars(starsCount);
        fence.setInteractive(true);
        this.showArrow(fence);
    }

    public openLocation(): void {
        const fence: Fence = this._locations[this._currentLocationId].getFence();
        fence.setInteractive(false);
        fence.open();

        const mapLevel: MapLevel = this.getMapLevelById(User.level);
        mapLevel.setLevelData( Levels.getLevelByID( User.level ) );
        mapLevel.setUserLevelData( User.getUserLevelByID( User.level ) );
        mapLevel.setAvailability(true);
        mapLevel.setActive(true);
        this._locations[User.location].setMarkerToLevel(mapLevel);
        this.showArrow(mapLevel);
        this._currentLevel = mapLevel;
        this._currentLocationId = User.location;

        this.setMaxDrag();

        this.scrollMapToCurrentLevel();

        this.showTooltipOnLevel(this._currentLevel);

        this.updateVisibleLocations();

        this._clouds.clearClouds(()=>{
            this._clouds.alignClouds();
            this._clouds.y = this._locations[this._nextLocationId].y;
        });
    }
}
