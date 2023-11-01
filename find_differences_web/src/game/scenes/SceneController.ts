import * as PIXI from 'pixi.js';
import {SceneLobby} from "./SceneLobby";
import {SceneLevel} from "./SceneLevel";
import {SceneTrophyRoom} from "./SceneTrophyRoom";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import {URL_LEVEL_START} from "../../constants/urls";
import User from "../../data/User";
import ScreenBlock from "../components/common/ScreenBlock";
import Resource from "../../data/Resource";
import Api from "../../utils/Api";
import {PlayedLevelModel, StartModel} from "../../models/ApiModels";
import {debug} from "../../App";

export default class SceneController {

    private static _instance: SceneController;

    public static instance(): SceneController {
        return this._instance;
    }

    private _sceneLobby : SceneLobby;
    private _sceneLevel : SceneLevel;
    private _sceneTrophyRoom: SceneTrophyRoom;

    private _levelStartSubscription: EventModel;
    private _levelLeaveSubscription: EventModel;


    constructor( private _stage: PIXI.Container ) {
        if ( !SceneController._instance ) {
            SceneController._instance = this;
            this._levelStartSubscription = EventBus.subscribe(events.EVENT_ON_LEVEL_START, this.gotoLevel.bind(this));
            this._levelLeaveSubscription = EventBus.subscribe(events.EVENT_ON_LEVEL_LEAVE, this.gotoLobby.bind(this));
        }
    }

    public showSceneLevel( levelData : PlayedLevelModel ) : void {
        this.removeSceneLevel();
        this._sceneLevel = new SceneLevel( levelData );
        this._stage.addChild( this._sceneLevel );
    }

    public removeSceneLevel() : void {
        if ( this._sceneLevel ) {
            this._sceneLevel.removeFromParent();
            this._sceneLevel.destroy( {children:true}  );
            this._sceneLevel = null;
        }
    }

    public showSceneLobby(afterLevel: boolean = false) : void {
        this.removeSceneLobby();
        this._sceneLobby = new SceneLobby();
        this._stage.addChild( this._sceneLobby );
        this._sceneLobby.init(afterLevel);
    }

    private removeSceneLobby() : void {
        if ( this._sceneLobby ) {
            this._sceneLobby.removeFromParent();
            this._sceneLobby.destroy( {children:true}  );
            this._sceneLobby = null;
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

    public gotoLevel( levelId : number, startPictureId?:number ) : void {
        ScreenBlock.show();

        Api.request(URL_LEVEL_START+levelId+(startPictureId > 0 ? "&startPictureId="+startPictureId : "")).then( async ( loader: Response ) => {
            ScreenBlock.hide();

            const obj: any = await loader.json();
            const data:StartModel = obj as StartModel;

            User.update(data.user);
            User.checkAddUserLevel({levelId:levelId, stars: 0});

            this.removeSceneLobby();
            this.removeSceneTrophyRoom();
            this.showSceneLevel( data.playedLevel );
        } ).catch(()=>{
            ScreenBlock.hide();
            EventBus.publish( events.EVENT_ON_NETWORK_ERROR );
        });
    }

    public gotoLobby() : void {
        this.removeSceneLevel();
        this.removeSceneTrophyRoom();
        this.showSceneLobby(true);
    }

    public gotoTrophyRoom() : void {
        this.removeSceneLevel();
        this.removeSceneLobby();
        this.showSceneTrophyRoom();
    }

    public gotoStartScene() : void {

        const urlParams = new URLSearchParams( window.location.search);
        const startPictureId: number = parseInt(urlParams.get("startPictureId"));
        if ( debug && startPictureId ) {
            this.gotoLevel(20, startPictureId);//5 - 1, 6 - 13, 7 - 20
            return;
        }

        if ( User.playedLevel ) {
            this.showSceneLevel(User.playedLevel);
        } else {
            this.showSceneLobby();
        }
    }
}
