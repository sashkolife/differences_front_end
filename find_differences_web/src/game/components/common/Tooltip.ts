import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../../components/CContainer";
import {DisplayObject} from "pixi.js";

export default class Tooltip extends CContainer {
    private _scaleY:number = 1;

    constructor( props: any ) {
        super( props );
        this._scaleY = this.scale.y;
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this.scale);
        super.destroy(_options);
    }

    public setObject(obj: DisplayObject): void {

    }

    public show(data?:any) : void {
        this._scaleY = this.scale.y;
        this.scale.y = 0;
        this.visible = true;

        gsap.to( this.scale, { duration: 0.02, "y": this._scaleY } );
    }

    hide() : void {
        gsap.killTweensOf(this.scale);
        this.visible = false;
    }
}
