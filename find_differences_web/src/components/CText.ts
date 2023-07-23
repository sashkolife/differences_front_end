import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import Localization from "../data/Localization";

export default class CText extends PIXI.Text {
    setProperties( props:any ) {}
    removeOrientationEvent() {}

    constructor( props: any ) {
        super();

        this.style = props[constants.KEY_STYLE];

        if ( props[constants.KEY_TEXT_KEY] ) {
            this.text = Localization.get(props[constants.KEY_TEXT_KEY]);
        }
        this.resolution = 2;

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CText, [CBase, PIXI.Text] );