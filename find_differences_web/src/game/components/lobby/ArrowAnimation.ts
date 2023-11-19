import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSprite from "../../../components/CSprite";
import Localization from "../../../data/Localization";
import {CampaignModel} from "../../../models/ApiModels";

export default class ArrowAnimation extends CContainer {
    private _arrow: CSprite;

    constructor( props: any ) {
        super( props );
        this._arrow = this.getComponentByName("arrow");
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this._arrow.position);
        super.destroy(_options);
    }

    show( obj: PIXI.DisplayObject ) : void {
        this._arrow.visible = true;
        gsap.killTweensOf(this._arrow.position);
        const gl: PIXI.Point = obj.toGlobal(new PIXI.Point(this.properties.x||0,this.properties.y||0));
        const loc: PIXI.Point = this.parent.toLocal(gl);
        this.x = loc.x;
        this.y = loc.y;
        gsap.to( this._arrow.position, { duration:0.5, "y": "+=10", yoyo: true, repeat: -1 } );
    }

    hide() : void {
        gsap.killTweensOf(this._arrow.position);
        this.visible = false;
    }
}
