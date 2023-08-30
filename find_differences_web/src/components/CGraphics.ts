import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import {GraphicsModel} from "../models/PropertiesModels";

export default class CGraphics extends PIXI.Graphics {
    properties: GraphicsModel;
    setProperties( props:GraphicsModel ) {}
    removeOrientationEvent() {}

    constructor( props: GraphicsModel ) {
        super();

        this.setProperties( props );

        this.drawFigure();
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }

    drawFigure() {

        this.clear();

        if ( this.properties.figure ) {
            if ( this.properties.figure.fillColor ) {
                this.beginFill(this.properties.figure.fillColor);
            }

            if ( this.properties.figure.rect ) {
                const r:any = this.properties.figure.rect;
                this.drawRect( r.x, r.y, r.width, r.height );
            }

            this.endFill();
        }
    }
}

Mixin.applyMixins( CGraphics, [CBase] );