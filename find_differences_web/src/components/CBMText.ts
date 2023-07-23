import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import Localization from "../data/Localization";

export default class CBMText extends PIXI.BitmapText {
    setProperties( props:any ) {}
    removeOrientationEvent() {}

    constructor( props: any ) {
        let text:string = "";
        if ( props[constants.KEY_TEXT_KEY] ) {
            text = Localization.get(props[constants.KEY_TEXT_KEY]);
        }
        super(text, props[constants.KEY_STYLE]);

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CBMText, [CBase, PIXI.BitmapText] );