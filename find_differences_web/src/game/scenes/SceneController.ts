import * as PIXI from 'pixi.js';
import {SceneLobby} from "./SceneLobby";
import {SceneLevel} from "./SceneLevel";
import {SceneTrophyRoom} from "./SceneTrophyRoom";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import User from "../../data/User";
import {CampaignModel, LevelModel} from "../../models/ApiModels";
import {debug} from "../../App";
import {SceneCampaign} from "./SceneCampaign";
import Properties from "../../data/Properties";
import * as levelUtils from "../../utils/LevelsUtils";
import Campaigns from "../../data/Campaigns";

export default class SceneController {

    private static _instance: SceneController;

    public static instance(): SceneController {
        return this._instance;
    }

    private _sceneLobby : SceneLobby;
    private _sceneCampaign : SceneCampaign;
    private _sceneLevel : SceneLevel;
    private _sceneTrophyRoom: SceneTrophyRoom;

    private _levelStartSubscription: EventModel;
    private _levelLeaveSubscription: EventModel;
    private _campaignLeaveSubscription: EventModel;

    private _currentLevelData: LevelModel;
    private _currentCampaignData: CampaignModel;

    constructor( private _stage: PIXI.Container ) {
        if ( !SceneController._instance ) {
            SceneController._instance = this;
            this._levelStartSubscription = EventBus.subscribe(events.EVENT_ON_LEVEL_START, this.gotoLevel.bind(this));
            this._levelLeaveSubscription = EventBus.subscribe(events.EVENT_ON_LEVEL_LEAVE, this.onLevelLeave.bind(this));
            this._campaignLeaveSubscription = EventBus.subscribe(events.EVENT_ON_CAMPAIGN_LEAVE, this.gotoLobby.bind(this));
        }
    }

    public showSceneLevel() : void {
        if (!this._sceneLevel) {
            this._sceneLevel = new SceneLevel();
            this._stage.addChild(this._sceneLevel);
        }
        this._sceneLevel.startLevel(this._currentLevelData)
    }

    public removeSceneLevel() : void {
        if ( this._sceneLevel ) {
            this._sceneLevel.removeFromParent();
            this._sceneLevel.destroy( {children:true}  );
            this._sceneLevel = null;
        }
    }

    public showSceneLobby() : void {
        this.removeSceneLobby();
        this._sceneLobby = new SceneLobby(Properties.get("sceneLobby"));
        this._stage.addChild( this._sceneLobby );
        this._sceneLobby.init(this._currentLevelData != null);
    }

    public showSceneCampaign() : void {
        this.removeSceneCampaign();
        this._sceneCampaign = new SceneCampaign(Properties.get("campaign"+this._currentCampaignData.id), this._currentCampaignData);
        this._stage.addChild( this._sceneCampaign );
        this._sceneCampaign.init(this._currentLevelData != null);
    }

    private removeSceneLobby() : void {
        if ( this._sceneLobby ) {
            this._sceneLobby.removeFromParent();
            this._sceneLobby.destroy( {children:true}  );
            this._sceneLobby = null;
        }
    }

    private removeSceneCampaign() : void {
        if ( this._sceneCampaign ) {
            this._sceneCampaign.removeFromParent();
            this._sceneCampaign.destroy( {children:true}  );
            this._sceneCampaign = null;
        }
    }

    public showSceneTrophyRoom() : void {
        this.removeSceneTrophyRoom();
        this._sceneTrophyRoom = new SceneTrophyRoom();
        this._stage.addChild( this._sceneTrophyRoom );
        this._sceneTrophyRoom.init();
    }

    private removeSceneTrophyRoom() : void {
        if ( this._sceneTrophyRoom ) {
            this._sceneTrophyRoom.destroy( { children : true } );
            this._sceneTrophyRoom = null;
        }
    }

    private onLevelLeave(): void {
        if (this._currentCampaignData) {
            this.gotoCampaign(this._currentCampaignData);
        } else {
            this.gotoLobby();
        }
    }

    public gotoLevel( levelData?:LevelModel ) : void {
        this._currentLevelData = levelData || this.getDefaultLevel();
        this.removeSceneLobby();
        this.removeSceneCampaign();
        this.removeSceneTrophyRoom();
        this.showSceneLevel();
    }

    private getDefaultLevel(): LevelModel {
        if (this._currentCampaignData) {
            return levelUtils.getLevelByID(this._currentCampaignData.levels, this._currentCampaignData.level);
        }
        return levelUtils.getLevelByID(User.levels, User.level);
    }

    public gotoLobby() : void {
        this.removeSceneCampaign();
        this.removeSceneLevel();
        this.removeSceneTrophyRoom();
        this.showSceneLobby();
        this._currentLevelData = null;
        this._currentCampaignData = null;
    }

    public gotoTrophyRoom() : void {
        this.removeSceneCampaign();
        this.removeSceneLevel();
        this.removeSceneLobby();
        this.showSceneTrophyRoom();
    }

    public gotoCampaign(campaign: CampaignModel) : void {
        this.removeSceneLevel();
        this.removeSceneLobby();
        this.removeSceneTrophyRoom();
        this._currentCampaignData = campaign;
        this.showSceneCampaign();
        this._currentLevelData = null;
    }

    public gotoStartScene() : void {

        const urlParams = new URLSearchParams( window.location.search);
        const startLevelId: number = parseInt(urlParams.get("startLevelId"));
        if ( debug && startLevelId ) {
            this.gotoLevel(levelUtils.getLevelByID(User.levels, startLevelId));//5 - 1, 6 - 13, 7 - 20
            return;
        }

        if (User.playedLevelId > 0) {
            if (User.playedCampaignId > 0) {
                this._currentCampaignData = Campaigns.getCampaignById(User.playedCampaignId);
                this._currentLevelData = levelUtils.getLevelByID(this._currentCampaignData.levels, User.playedLevelId);
            } else {
                this._currentLevelData = levelUtils.getLevelByID(User.levels, User.playedLevelId);
            }
        }

        if ( this._currentLevelData ) {
            this.gotoLevel(this._currentLevelData);
        } else {
            this.showSceneLobby();
        }
    }
}
