import * as PIXI from 'pixi.js';
import gsap from "gsap";
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CBMText from "../../../components/CBMText";
import {ContainerModel} from "../../../models/PropertiesModels";

export default class ThreeStateStar extends CContainer {
    private _starEmpty: CSprite;
    private _starFull: CSprite;
    private _starBlick: CSprite;
    private _starLight: CSprite;

    private _isEmpty: boolean = true;

    constructor( props: ContainerModel ) {
        super( props );
        this._starEmpty = this.getComponentByName("starEmpty");
        this._starFull = this.getComponentByName("starFull");
        this._starBlick = this.getComponentByName("starBlick");
        this._starLight = this.getComponentByName("starLight")

    }

    setEmpty(animate?: boolean) : void {
        if ( animate === true && !this._isEmpty ) {
            gsap.to(this._starFull, {duration: 0.5, alpha: 0}).then( () => {
                this._starFull.visible = false;
                this._starFull.alpha = 1;
            } );
        } else
            this._starFull.visible = false;
        this._isEmpty = true;
    }

    setFull(animate?: boolean) : void {
        if ( animate === true && this._isEmpty ) {
            this._starBlick.visible = true;
            this._starLight.visible = true;
            this._starBlick.alpha = 0;
            this._starLight.alpha = 0;
            this._starLight.angle = 0;
            gsap.to(this._starBlick, {duration: 0.2, alpha: 1}).then( () => {
                gsap.to(this._starBlick, {duration: 0.8, alpha: 0});
            } );
            gsap.to(this._starLight, {duration: 0.5, alpha: 1, angle: 5}).then( () => {
                gsap.to(this._starLight, {duration: 0.5, alpha: 0, angle: 5});
            } );
        }
        this._starFull.alpha = 1;
        this._starFull.visible = true;
        this._isEmpty = false;
    }

    isEmpty(): boolean {
        return this._isEmpty;
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this._starBlick);
        gsap.killTweensOf(this._starLight);
        super.destroy(_options);
    }
}
