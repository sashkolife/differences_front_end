import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";

export default class CGraphics extends PIXI.Graphics {
    properties: any
    setProperties( props:any ) {}
    removeOrientationEvent() {}

    constructor( props: any ) {
        super();

        this.setProperties( props );

        this.drawFigure();
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }

    drawFigure() {
        const figureProps:any = this.properties[constants.KEY_FIGURE];

        this.clear();

        if ( figureProps ) {
            if ( figureProps[constants.KEY_FILL_COLOR] ) {
                this.beginFill(figureProps[constants.KEY_FILL_COLOR]);
            }

            if ( figureProps[constants.KEY_RECT] ) {
                const r:any = figureProps[constants.KEY_RECT];
                this.drawRect( r.x, r.y, r.width, r.height );
            }

            this.endFill();
        }
    }
}

Mixin.applyMixins( CGraphics, [CBase, PIXI.Graphics] );