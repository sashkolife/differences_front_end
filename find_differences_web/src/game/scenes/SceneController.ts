import * as PIXI from 'pixi.js';
import {SceneLobby} from "./SceneLobby";
import {SceneLevel} from "./SceneLevel";
import {SceneTrophyRoom} from "./SceneTrophyRoom";

export default class SceneController {
    private _sceneLobby : SceneLobby;
    private _sceneLevel : SceneLevel;
    private _sceneTrophyRoom: SceneTrophyRoom;

    constructor( private _stage: PIXI.Container ) {
    }

    public showSceneLevel( levelId : number ) : void {
        this.removeSceneLevel();
        this._sceneLevel = new SceneLevel( levelId );
        this._stage.addChild( this._sceneLevel );
        this._sceneLevel.init();
    }

    public removeSceneLevel() : void {
        if ( this._sceneLevel ) {
            this._sceneLevel.destroy( { children : true } );
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
            this._sceneLobby.destroy( { children : true } );
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
        this.removeSceneLobby();
        this.removeSceneTrophyRoom();
        this.showSceneLevel( levelId );
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
        this.showSceneLobby();
    }
}
