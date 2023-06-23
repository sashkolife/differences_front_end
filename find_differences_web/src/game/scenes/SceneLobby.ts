import * as PIXI from 'pixi.js';
import ExpProgressBar from "../components/ExpProgressBar";
import Map from "../components/Map";
import Properties from "../../data/Properties";
import ComponentBase from "../../components/ComponentBase";
import GameSprite from "../../components/GameSprite";
// import ComponentsFactory from "../../components/ComponentsFactory";

export class SceneLobby extends PIXI.Container {
    private _topBar : ComponentBase;
    private _expProgressBar : ExpProgressBar;
    private _map : Map;

    constructor() {
        super();
    }

    init() : void {
        // this._map = new Map( this._properties["map"] );

        this._topBar = new GameSprite( "lobby_top_bar", this as PIXI.Container);

        // this._expProgressBar = new ExpProgressBar( this._properties["exp_progress_bar"] );
        // this.addChild( this._expProgressBar );
    }

}
