import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import {Slice9Model} from "../models/PropertiesModels";

export default class CSlice9 extends PIXI.NineSlicePlane {
    setProperties( props:Slice9Model ) {}
    removeOrientationEvent() {}

    constructor( props: Slice9Model ) {
        super(Resource.getTexture( props.texture ));

        this.setProperties( props );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( CSlice9, [CBase] );