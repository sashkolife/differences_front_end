import gsap from 'gsap';
import {IDestroyOptions} from 'pixi.js';
import CContainer from "../../components/CContainer";
import CSprite from "../../components/CSprite";
import Properties from "../../data/Properties";
import {game} from "../../App";
import * as constants from "../../constants/constants";
import * as PIXI from "pixi.js";

export default class ScreenBlock extends CContainer {

    private static _instance: ScreenBlock;

    public static show() : void {
        if ( !this._instance ) {
            this._instance = new ScreenBlock();
            game.stage.addChild(this._instance);
        }
    }

    public static hide() : void {
        if ( this._instance ) {
            game.stage.removeChild( this._instance );
            this._instance.destroy();
            this._instance = null;
        }
    }

    private _background: CSprite;
    private _spinner: CContainer;
    private _boxes: Array<CSprite>;

    private _boxesTween: any = null;

    private _showTimer:number = null;

    constructor() {
        super( Properties.get("screenBlock") );

        this._background = this.getComponentByName("background");
        this._spinner = this.getComponentByName("spinner");

        this._boxes = this._spinner.getComponentsByType(constants.COMPONENT_SPRITE);

        this._boxesTween = gsap.timeline({repeat:-1});
        this._boxesTween.to(this._boxes[0], {duration:0.6,alpha:1});
        this._boxesTween.to(this._boxes[0], {duration:0.8,alpha:0.2});
        this._boxesTween.to(this._boxes[1], {duration:0.6,alpha:1}, "-=0.8");
        this._boxesTween.to(this._boxes[1], {duration:0.8,alpha:0.2});
        this._boxesTween.to(this._boxes[2], {duration:0.6,alpha:1}, "-=0.8");
        this._boxesTween.to(this._boxes[2], {duration:0.8,alpha:0.2});

        this.alpha = 0.05;

        this._showTimer = window.setTimeout( () => {
            this.alpha = 1;
        }, 2000 );
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        window.clearTimeout( this._showTimer );

        if ( this._boxesTween ) {
            this._boxesTween.kill();
            this._boxesTween = null;
        }
        super.destroy(_options);
    }

}
