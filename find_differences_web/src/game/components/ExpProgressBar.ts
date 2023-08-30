import * as PIXI from 'pixi.js';
import CSprite from "../../components/CSprite";
import CContainer from "../../components/CContainer";
import CBMText from "../../components/CBMText";
import {ContainerModel} from "../../models/PropertiesModels";

export default class ExpProgressBar extends CContainer {

    private _progressLine: CSprite;
    private _starsValue: CBMText;

    constructor( props: ContainerModel ) {
        super( props );

        const mContainer: CContainer = this.getComponentByName("maskContainer");
        this._progressLine = mContainer.getComponentByName("progressLine");

        this._starsValue = this.getComponentByName("starsValue");
        this._starsValue.text = "99";
    }

    init() : void {
        //const bg : GameSprite = ComponentsFactory.getSprite(this._settings["bg"], this);


    }
}
