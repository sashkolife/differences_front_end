import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import {SpriteModel} from "../models/PropertiesModels";

export default class CSprite extends PIXI.Sprite {
    properties:SpriteModel;
    setProperties( props:SpriteModel ) {}
    removeOrientationEvent() {}

    constructor( props: SpriteModel ) {
        super();

        if ( props.texture ) {
            this.texture = Resource.getTexture(props.texture);
        }

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CSprite, [CBase] );