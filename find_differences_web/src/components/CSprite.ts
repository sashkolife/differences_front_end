import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";

export default class CSprite extends PIXI.Sprite {
    properties:any;
    setProperties( props:any ) {}
    removeOrientationEvent() {}

    constructor( props: any ) {
        super();

        if ( props[constants.KEY_TEXTURE] ) {
            this.texture = Resource.getTexture(props[constants.KEY_TEXTURE]);
        }

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CSprite, [CBase, PIXI.Sprite] );