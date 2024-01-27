import * as PIXI from 'pixi.js';
import gsap from "gsap";
import Resource from "../../../data/Resource";

export default class Spinner extends PIXI.Sprite {
    private readonly _interval: any;
    constructor(private _parent: PIXI.Container, pos: PIXI.Point) {
        super(Resource.getTexture("spinner"));
        _parent.addChild(this);
        this.position = _parent.toLocal(pos);
        this.anchor.set(0.5, 0.5);
        this._interval = setInterval(()=>{
            this.angle += 45;
            if (this.angle >= 360) {
                this.angle = 0;
            }
        }, 100);
    }

    remove() {
        this.removeFromParent();
        this.destroy();
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        clearInterval(this._interval);
        super.destroy(_options);
    }
}