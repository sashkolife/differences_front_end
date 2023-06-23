import ComponentBase from "./ComponentBase";
import {COMPONENT_SPRITE, KEY_TEXTURE} from "../constants/constants";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";

export default class GameSprite extends ComponentBase {

    constructor( key : string, parent:PIXI.Container ) {
        super(key, parent);
    }

    getType(): string {
        return COMPONENT_SPRITE;
    }

    protected createDisplayObject() : void {
        this._displayObject = new PIXI.Sprite();
    }

    protected setParameter( key: string, data : any ) : void {
        if ( key == KEY_TEXTURE ) {
            this._displayObject.texture = Resource.getTexture(data);
        } else {
            super.setParameter(key, data);
        }
    }
}