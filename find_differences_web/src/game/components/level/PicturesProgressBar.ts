import * as PIXI from 'pixi.js';
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSlice9 from "../../../components/CSlice9";
import CBMText from "../../../components/CBMText";
import {ContainerModel} from "../../../models/PropertiesModels";

export default class PicturesProgressBar extends CContainer {

    private _bg: CSlice9;
    private _currentPictureFlag: CSprite;
    private _pictureNumTexts: Array<CBMText>;

    private _picturesCount:number = 0;
    private _currentPictureNum:number = 1;

    constructor( props: ContainerModel ) {
        super( props );

        this._bg = this.getComponentByName("bg");

        this._currentPictureFlag = this.getComponentByName("currentPictureFlag");

        this._pictureNumTexts = [
            this.getComponentByName("pictureNum0Text"),
            this.getComponentByName("pictureNum1Text"),
            this.getComponentByName("pictureNum2Text"),
            this.getComponentByName("pictureNum3Text"),
            this.getComponentByName("pictureNum4Text"),
            this.getComponentByName("pictureNum5Text"),
            this.getComponentByName("pictureNum6Text"),
            this.getComponentByName("pictureNum7Text"),
            this.getComponentByName("pictureNum8Text"),
            this.getComponentByName("pictureNum9Text")
        ];

        this._currentPictureFlag.x = this._pictureNumTexts[0].x;
    }

    setCount( num: number, current: number ) : void {
        this._picturesCount = num;

        for ( let i : number = 0; i < 10; i++ ) {
            this._pictureNumTexts[i].visible = i < this._pictureNumTexts.length && i < this._picturesCount;
        }
        this._bg.width = this._pictureNumTexts[this._picturesCount-1].x + 30;

        this.setCurrent(current);
    }

    setCurrent( num: number ) : void {
        this._currentPictureNum = num;
        this._currentPictureFlag.x = this._pictureNumTexts[this._currentPictureNum-1].x;
    }
}
