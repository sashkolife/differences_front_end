import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import Localization from "../data/Localization";
import {BitmapTextModel} from "../models/PropertiesModels";

export default class CBMText extends PIXI.BitmapText {
    setProperties( props:BitmapTextModel ) {};
    removeOrientationEvent() {};

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
}

Mixin.applyMixins( CBMText, [CBase] );