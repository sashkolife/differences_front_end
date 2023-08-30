import * as PIXI from 'pixi.js';
import {SceneLobby} from "./SceneLobby";
import {SceneLevel} from "./SceneLevel";
import {SceneTrophyRoom} from "./SceneTrophyRoom";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import {URL_LEVEL_LEAVE, URL_LEVEL_START, URL_LEVELS} from "../../constants/urls";
import User from "../../data/User";
import ScreenBlock from "../components/ScreenBlock";
import Resource from "../../data/Resource";
import Api from "../../utils/Api";
import {PlayedLevelModel, StartModel} from "../../models/ApiModels";

export default class SceneController {

    private static _instance: SceneController;

    public static instance(): SceneController {
        return this._instance;
    }

    private _sceneLobby : SceneLobby;
    private _sceneLevel : SceneLevel;
    private _sceneTrophyRoom: SceneTrophyRoom;

    private _levelStartSubscription: any;
    private _levelLeaveSubscription: any;


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
        this._sceneLevel.init();
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
        this._sceneLobby = new SceneLobby();
        this._stage.addChild( this._sceneLobby );
        this._sceneLobby.init();
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

    public gotoLevel( levelId : number ) : void {
        ScreenBlock.show();
        Api.request(URL_LEVEL_START+levelId).then( async ( loader: Response ) => {
            const obj: any = await loader.json();
            const data:StartModel = obj as StartModel;

            User.update(data.user);

            this.loadPicture(data.playedLevel);
        } );
    }

    private loadPicture( data:PlayedLevelModel ) {
        Resource.loadPicture(data.picture, (p:number) => {}).then( () => {
            this.removeSceneLobby();
            this.removeSceneTrophyRoom();
            this.showSceneLevel( data );
            ScreenBlock.hide();
        } );
    }

    public gotoLobby() : void {
        this.removeSceneLevel();
        this.removeSceneTrophyRoom();
        this.showSceneLobby();
    }

    public gotoTrophyRoom() : void {
        this.removeSceneLevel();
        this.removeSceneLobby();
        this.showSceneTrophyRoom();
    }

    public gotoStartScene() : void {
        if ( User.playedLevel ) {
            ScreenBlock.show();
            this.loadPicture(User.playedLevel);
        } else {
            this.showSceneLobby();
        }
    }
}
