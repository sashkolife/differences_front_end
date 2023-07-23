import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";

export default class CSlice9 extends PIXI.NineSlicePlane {
    setProperties( props:any ) {}
    removeOrientationEvent() {}

    constructor( props: any ) {
        super(Resource.getTexture( props[constants.KEY_TEXTURE] ));

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CSlice9, [CBase, PIXI.NineSlicePlane] );