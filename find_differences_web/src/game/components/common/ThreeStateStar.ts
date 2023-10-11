import * as PIXI from 'pixi.js';
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CBMText from "../../../components/CBMText";
import {ContainerModel} from "../../../models/PropertiesModels";

export default class ThreeStateStar extends CContainer {
    private _starEmpty: CSprite;
    private _starFull: CSprite;
    private _starBlick: CSprite;
    private _starLight: CSprite;

    constructor( props: ContainerModel ) {
        super( props );
        this._starEmpty = this.getComponentByName("starEmpty");
        this._starFull = this.getComponentByName("starFull");
        this._starBlick = this.getComponentByName("starBlick");
        this._starLight = this.getComponentByName("starLight")

    }

    setEmpty() : void {
        this._starFull.visible = false;
    }

    setFull() : void {
        this._starFull.visible = true;
    }

    isEmpty(): boolean {
        return !this._starFull.visible;
    }
}
