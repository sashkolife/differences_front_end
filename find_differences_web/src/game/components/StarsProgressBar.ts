import * as PIXI from 'pixi.js';
import CSprite from "../../components/CSprite";
import CContainer from "../../components/CContainer";
import CText from "../../components/CText";

export default class StarsProgressBar extends CContainer {

    private _progressLine: CSprite;
    private _fillStar0: CSprite;
    private _fillStar1: CSprite;
    private _fillStar2: CSprite;

    constructor( props: any ) {
        super( props );

        const mContainer: CContainer = this.getComponentByName("maskContainer");
        this._progressLine = mContainer.getComponentByName("progressLine");

        this._fillStar0 = this.getComponentByName("fillStar0");
        this._fillStar1 = this.getComponentByName("fillStar1");
        this._fillStar2 = this.getComponentByName("fillStar2");
    }

    init() : void {
        //const bg : GameSprite = ComponentsFactory.getSprite(this._settings["bg"], this);


    }

}
