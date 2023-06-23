import {Application, Container} from 'pixi.js';
import SceneController from "./scenes/SceneController";
import WindowsController from "./windows/WindowsController";

export class Game extends Application<HTMLCanvasElement> {

    private _sceneController: SceneController = null;
    private _windowController: WindowsController = null;

    constructor( options: any ) {
        super( options );

    }

    init() : void {
        const sceneContainer : Container = new Container();
        this.stage.addChild( sceneContainer );
        this._sceneController = new SceneController( sceneContainer );

        const windowContainer : Container = new Container();
        this.stage.addChild( windowContainer );
        this._windowController = new WindowsController( windowContainer );

        this._sceneController.gotoStartScene();

    }

}
