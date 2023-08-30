import CBase from "./CBase";
import * as PIXI from "pixi.js";
import Mixin from "../utils/Mixin";
import Localization from "../data/Localization";
import {TextModel} from "../models/PropertiesModels";

export default class CText extends PIXI.Text {
    setProperties( props:TextModel ) {}
    removeOrientationEvent() {}

    constructor( props: TextModel ) {
        super();

        this.style = props.style;

        if ( props.textKey ) {
            this.text = Localization.get(props.textKey);
        }
        this.resolution = 2;

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CText, [CBase] );