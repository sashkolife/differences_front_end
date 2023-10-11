import * as PIXI from 'pixi.js';
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CBMText from "../../../components/CBMText";
import {ComponentModel, ContainerModel} from "../../../models/PropertiesModels";
import {COMPONENT_THREE_STATE_STAR} from "../../../constants/constants";
import ThreeStateStar from "../common/ThreeStateStar";

export default class LobbyStarsProgressBar extends CContainer {

    private _star: ThreeStateStar;
    private _progressLine: CSprite;
    private _key: CSprite;
    private _starsValue: CBMText;

    private _starsMax: number = 0;
    private _starsNum: number = 0;

    constructor( props: ContainerModel ) {
        super( props );

        this._star = this.getComponentByName("star");
        this._key = this.getComponentByName("key");

        const mContainer: CContainer = this.getComponentByName("maskContainer");
        this._progressLine = mContainer.getComponentByName("progressLine");

        this._starsValue = this.getComponentByName("starsValue");
    }

    getNewComponentByType(props: ComponentModel): any {
        if ( props.type === COMPONENT_THREE_STATE_STAR ) {
            return new ThreeStateStar(props);
        }
        return super.getNewComponentByType(props);
    }

    private updateView( animate: boolean = false ): void {
        this._starsValue.text = this._starsNum + "/" + this._starsMax;
        this._progressLine.x = this._progressLine.width*this._starsNum/this._starsMax;
        if (this._starsNum === this._starsMax) {
            this._key.visible = false;
        }
    }

    public setStarsMax(max: number, current: number) : void {
        this._starsMax = max;
        this.setStars(current);
    }

    public setStars(value: number): void {
        this._starsNum = Math.min(this._starsMax, value);
        this.updateView();
    }

    public getKey(): CSprite {
        return this._key;
    }
}
