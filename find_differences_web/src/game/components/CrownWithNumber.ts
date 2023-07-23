import * as PIXI from "pixi.js";
import Resource from "../../data/Resource";

export default class CrownWithNumber extends PIXI.Container {

    private _labelValue:PIXI.BitmapText;

    constructor() {
        super();

        const crown:PIXI.Sprite = new PIXI.Sprite(Resource.getTexture("crown_icon"));
        crown.anchor.set(0.5);
        this.addChild(crown);

        const circle:PIXI.Sprite = new PIXI.Sprite(Resource.getTexture("crown_sub"));
        circle.anchor.set(0.5);
        this.addChild(circle);

        this._labelValue = new PIXI.BitmapText("", );
    }
}