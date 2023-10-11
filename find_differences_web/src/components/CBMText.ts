import CBase from "./CBase";
import * as PIXI from "pixi.js";
import Mixin from "../utils/Mixin";
import Localization from "../data/Localization";
import {BitmapTextModel} from "../models/PropertiesModels";

export default class CBMText extends PIXI.BitmapText {
    setProperties( props:BitmapTextModel ) {};
    removeOrientationEvent() {};
    properties:BitmapTextModel;

    constructor( props: BitmapTextModel ) {
        let text:string = "";
        if ( props.textKey ) {
            text = Localization.get(props.textKey);
        }
        super(text, props.style);

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }

    get textKey() : string {
        return this.properties.textKey;
    }
}

Mixin.applyMixins( CBMText, [CBase] );