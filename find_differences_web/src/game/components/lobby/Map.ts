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
import WindowsController from "../../windows/WindowsController";
import LevelStartWindow from "../../windows/LevelStartWindow";
import {MapModel} from "../../../models/PropertiesModels";
import {CampaignModel, LevelModel, LocationModel} from "../../../models/ApiModels";
import Locations from "../../../data/Locations";
import CSprite from "../../../components/CSprite";
import CBase from "../../../components/CBase";
import Fence from "./Fence";
import {COMPONENT_ARROW_ANIMATION, COMPONENT_MAP_CAMPAIGN_TOOLTIP} from "../../../constants/constants";
import MapCampaignTooltip from "./MapCampaignTooltip";
import ArrowAnimation from "./ArrowAnimation";
import Campaigns from "../../../data/Campaigns";
import CampaignButton from "./CampaignButton";
import SceneController from "../../scenes/SceneController";
import * as levelUtils from "../../../utils/LevelsUtils";

export default class Map extends CContainer {

    private _mapLevelTooltip: MapLevelTooltip;
    private _mapLevelArrow: ArrowAnimation;
    private _mapCampaignTooltip: MapCampaignTooltip;
    private _mapCampaignArrow: ArrowAnimation;
    private _clouds: MapClouds;
    private _locations: Array<MapLocation>;

    private _currentLevel:MapLevel = null;

    private _currentViewedLocationId:number = 0;
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

    private _campaignOverSubscription:EventModel = null;
    private _campaignOutSubscription:EventModel = null;
    private _campaignClickSubscription:EventModel = null;

    constructor( props: MapModel ) {
        super( props );

        this._mapLevelTooltip = this.getComponentByName("mapLevelTooltip");
        this._mapLevelArrow = this.getComponentByName("mapLevelArrow");
        this._mapCampaignTooltip = this.getComponentByName("mapCampaignTooltip");
        this._mapCampaignArrow = this.getComponentByName("mapCampaignArrow");
        this._locations = this.getComponentsByType( constants.COMPONENT_LOCATION );
        this._clouds = this.getComponentByName("clouds");

        this._mapScale = (window as any).APP_WIDTH/2048;

        this._locationHeight = props.locationHeight;
        this._locationWidth = props.locationWidth;

        this.scale.set(this._mapScale, this._mapScale);
        this._mapLevelTooltip.scale.set(1/this._mapScale);

        this.addMapDragging();

        this._levelOverSubscription = EventBus.subscribe(events.EVENT_ON_MAP_LEVEL_OVER, this.onMapLevelOver.bind(this));
        this._levelOutSubscription = EventBus.subscribe(events.EVENT_ON_MAP_LEVEL_OUT, this.onMapLevelOut.bind(this));
        this._levelClickSubscription = EventBus.subscribe(events.EVENT_ON_MAP_LEVEL_CLICK, this.onMapLevelClick.bind(this));

        this._campaignOverSubscription = EventBus.subscribe(events.EVENT_ON_MAP_CAMPAIGN_OVER, this.onMapCampaignOver.bind(this));
        this._campaignOutSubscription = EventBus.subscribe(events.EVENT_ON_MAP_CAMPAIGN_OUT, this.onMapCampaignOut.bind(this));
        this._campaignClickSubscription = EventBus.subscribe(events.EVENT_ON_MAP_CAMPAIGN_CLICK, this.onMapCampaignClick.bind(this));
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this._levelOverSubscription.unsubscribe();
        this._levelOutSubscription.unsubscribe();
        this._levelClickSubscription.unsubscribe();

        this._campaignOverSubscription.unsubscribe();
        this._campaignOutSubscription.unsubscribe();
        this._campaignClickSubscription.unsubscribe();

        super.destroy(_options);
    }

    protected addMapDragging(): void {
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
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_ARROW_ANIMATION ) {
                component = new ArrowAnimation( props );
            }
            if ( props[constants.KEY_TYPE] == constants.COMPONENT_MAP_CAMPAIGN_TOOLTIP ) {
                component = new MapCampaignTooltip( props );
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

    protected onMove(e:any): void {

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
        const clonR: PIXI.Rectangle = this._screenRect.clone();
        let maxRectH: number = 0;
        let currentLocViewId: number = 0;
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

            const rectFit: PIXI.Rectangle = globalRect.fit(clonR);
            if (rectFit.height > maxRectH) {
                maxRectH = rectFit.height;
                currentLocViewId = i;
            }
            if ( location.visible ) {
                location.load();
            } else {
                location.stop();
            }
        }
        if (this._currentViewedLocationId != currentLocViewId) {
            this._currentViewedLocationId = currentLocViewId;
            EventBus.publish(events.EVENT_ON_LOCATION_CHANGE, this._currentViewedLocationId);
        }
    }

    public initMap() : void {

        const userLevel:number = this.getCurrentUserLevel();

        let i: number = 0;

        while ( i < this._locations.length && !this._currentLevel ) {
            const mapLevels: Array<MapLevel> = this._locations[i].getMapLevels();
            for (let j: number = 0; j < mapLevels.length; j++) {
                const mapLevel: MapLevel = mapLevels[j];
                const levelId:number = mapLevel.getId();
                mapLevel.setLevelData( this.getLevelData(levelId) );
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

    protected getCurrentUserLevel(): number {
        return User.level;
    }

    protected getLevelData(levelId:number): LevelModel {
        return levelUtils.getLevelByID( User.levels, levelId );
    }

    private setMaxDrag() : void {
        this._nextLocationId = this._currentLocationId+1;
        if ( this._nextLocationId >= this._locations.length ) {
            this._nextLocationId = this._currentLocationId;
        }
        let maxLocation:MapLocation = this._locations[this._nextLocationId];
        this._dragMax = Math.abs(maxLocation.y*this._mapScale );
    }

    protected scrollMapToCurrentLevel(animate?: boolean) : void {
        const currentLevelGL : PIXI.Point = this._currentLevel.toGlobal({"x":0,"y":0});
        const currentLevelMapLoc : PIXI.Point = (this as any).toLocal(currentLevelGL);

        let newY:number = Math.abs(currentLevelMapLoc.y*this._mapScale)+(this._screenRect.height>>1);

        if ( newY < this._dragMin ) {
            newY = this._dragMin;
        } else if ( newY > this._dragMax ) {
            newY = this._dragMax;
        }

        if ( animate ) {
            gsap.to(this, {duration: 1, y: newY});
        } else {
            this.y = newY;
        }

        this.updateVisibleLocations();

    }

    protected setFences() {
        for ( let i = 0; i < this._currentLocationId; i++ ) {
            this._locations[i].getFence().setOpened();
        }
        this._locations[this._currentLocationId].getFence().setActive();
    }

    private showTooltipOnLevel( mapLevel:MapLevel ) {
        const currentLevelGL : PIXI.Point = mapLevel.toGlobal({"x":0,"y":0});
        const currentLevelMapLoc : PIXI.Point = (this as any).toLocal(currentLevelGL);
        this._mapLevelTooltip.x = currentLevelMapLoc.x;
        this._mapLevelTooltip.y = currentLevelMapLoc.y + this._mapLevelTooltip.properties.y;
        this._mapLevelTooltip.show(mapLevel.getLevelData());
    }

    private showTooltipOnCampaign( campaign:CampaignButton ) {
        const currentLevelGL : PIXI.Point = campaign.toGlobal({"x":0,"y":0});
        const currentLevelMapLoc : PIXI.Point = (this as any).toLocal(currentLevelGL);
        this._mapCampaignTooltip.x = currentLevelMapLoc.x;
        this._mapCampaignTooltip.y = currentLevelMapLoc.y + this._mapLevelTooltip.properties.y;
        this._mapCampaignTooltip.show(campaign.getCampaignData());
    }

    protected addClouds() : void {
        if ( this._nextLocationId > this._currentLocationId ) {
            this._clouds.visible = true;
            this._clouds.y = this._locations[this._nextLocationId].y;
        }
    }

    private onMapLevelOver(mapLevel:MapLevel):void {
        this.showTooltipOnLevel(mapLevel);
    }

    private onMapLevelOut():void {
        this._mapLevelTooltip.hide();
        this._mapCampaignTooltip?.hide();
    }

    private onMapLevelClick( mapLevel:MapLevel ): void {
        WindowsController.instance().show(LevelStartWindow, {"levelData": mapLevel.getLevelData()});
    }

    private onMapCampaignOver(mapCampaign:CampaignButton):void {
        this.showTooltipOnCampaign(mapCampaign);
    }

    private onMapCampaignOut():void {
        this._mapLevelTooltip.hide();
        this._mapCampaignTooltip?.hide();
    }

    private onMapCampaignClick( mapCampaign:CampaignButton ): void {
        SceneController.instance().gotoCampaign(mapCampaign.getCampaignData());
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

    public setNewLevelsStars(levelsToUpdate: LevelModel[]) : void {
        levelsToUpdate.forEach( (uLevel: LevelModel) => {
           const mapLevel: MapLevel = this.getMapLevelById( uLevel.id );
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

        this.updateVisibleLocations();

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
        this._mapLevelArrow.show(obj);
    }

    public showCampaignArrow(obj: PIXI.DisplayObject): void {
        this._mapCampaignArrow.show(obj);
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
        mapLevel.setLevelData( levelUtils.getLevelByID( User.levels, User.level ) );
        mapLevel.setAvailability(true);
        mapLevel.setActive(true);
        this._locations[User.location].setMarkerToLevel(mapLevel);
        this.showArrow(mapLevel);
        this._currentLevel = mapLevel;
        this._currentLocationId = User.location;

        this.setMaxDrag();

        this.scrollMapToCurrentLevel(true);

        this.showTooltipOnLevel(this._currentLevel);

        this.updateVisibleLocations();

        this._clouds.clearClouds(()=>{
            this._clouds.alignClouds();
            this._clouds.y = this._locations[this._nextLocationId].y;
        });
    }

    public initCampaigns(): void {
        for ( let i: number = 0; i < this._locations.length && i <= User.location; i++ ) {
            const mapCampaigns: CampaignButton[] = this._locations[i].getMapCampaigns();

            for (let j: number = 0; j < mapCampaigns.length; j++) {
                const campData: CampaignModel = Campaigns.getCampaignById(mapCampaigns[j].properties.id);
                mapCampaigns[j].setCampaignData(campData);
                if ( campData && campData.startLevelId < User.level && campData.isComplete !== 1 ) {
                    this.showCampaignArrow(mapCampaigns[j]);
                }
            }
        }
    }

    private getMapCampaignButton(id: number): CampaignButton {
        for ( let i: number = 0; i < this._locations.length && i <= User.location; i++ ) {
            const mapCampaigns: CampaignButton[] = this._locations[i].getMapCampaigns();
            for (let j: number = 0; j < mapCampaigns.length; j++) {
                const campData: CampaignModel = Campaigns.getCampaignById(mapCampaigns[j].properties.id);
                if ( campData && campData.id == id ) {
                    return mapCampaigns[j];
                }
            }
        }
    }

    public scrollMapToCampaign(campaignId: number, callback: Function) : void {
        const campaignButton:CampaignButton = this.getMapCampaignButton(campaignId);
        const keyGL : PIXI.Point = campaignButton.toGlobal({"x":0,"y":0});
        const keyLoc : PIXI.Point = (this as any).toLocal(keyGL);

        let newY:number = Math.abs(keyLoc.y*this._mapScale)+(this._screenRect.height>>1);

        if ( newY < this._dragMin ) {
            newY = this._dragMin;
        } else if ( newY > this._dragMax ) {
            newY = this._dragMax;
        }

        gsap.to(this, {duration: 0.5, "y": newY, onComplete: () => callback()});

        this.updateVisibleLocations();

    }
}
