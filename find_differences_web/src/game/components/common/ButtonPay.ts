import CButton from "../../../components/CButton";
import {ButtonPayModel, ButtonPayStateModel, ComponentModel} from "../../../models/PropertiesModels";
import CFactory from "../../../components/CFactory";
import CSprite from "../../../components/CSprite";
import * as constants from "../../../constants/constants";
import CText from "../../../components/CText";

export default class ButtonPay extends CButton {

    private readonly _priceTextPropsNormal:ComponentModel = null;
    private readonly _priceTextPropsOver:ComponentModel = null;
    private readonly _priceTextPropsDown:ComponentModel = null;
    private readonly _priceTextPropsDisable:ComponentModel = null

    private readonly _priceImagePropsNormal:ComponentModel = null;
    private readonly _priceImagePropsOver:ComponentModel = null;
    private readonly _priceImagePropsDown:ComponentModel = null;
    private readonly _priceImagePropsDisable:ComponentModel = null;

    private _priceImage: CSprite;
    private _priceText: CText;

    private _priceValue: number = 0;

    constructor( props: ButtonPayModel ) {
        super( props );

        const stateNorm:ButtonPayStateModel = props.states.normal;
        this._priceTextPropsNormal = stateNorm.priceText;
        this._priceImagePropsNormal = stateNorm.priceImage;

        const stateOver:ButtonPayStateModel = props.states.over;
        if ( stateOver ) {
            this._priceTextPropsOver = stateOver.priceText;
            this._priceImagePropsOver = stateOver.priceImage;
        }

        const stateDown:ButtonPayStateModel = props.states.down;
        if ( stateDown ) {
            this._priceTextPropsDown = stateDown.priceText;
            this._priceImagePropsDown = stateDown.priceImage;
        }

        const stateDisable:ButtonPayStateModel = props.states.disable;
        if ( stateDisable ) {
            this._priceTextPropsDisable = stateDisable.priceText;
            this._priceImagePropsDisable = stateDisable.priceImage;
        }

        if ( props.priceImage ) {
            this._priceImage = CFactory.getNewComponent(props.priceImage);
            this.addChild(this._priceImage);
        }

        if ( props.priceText ) {
            this._priceText = CFactory.getNewComponent(props.priceText);
            this.addChild(this._priceText);
        }
    }

    setState( newState: string = constants.KEY_NORMAL ): void {
        if ( this.state == newState ) {
            return;
        }

        super.setState(newState);

        switch ( this.state ) {
            case constants.KEY_NORMAL:
                this.updatePriceText( this._priceTextPropsNormal );
                this.updatePriceImage( this._priceImagePropsNormal );
                break;
            case constants.KEY_OVER:
                this.updatePriceText( this._priceTextPropsOver );
                this.updatePriceImage( this._priceImagePropsOver );
                break;
            case constants.KEY_DOWN:
                this.updatePriceText( this._priceTextPropsDown );
                this.updatePriceImage( this._priceImagePropsDown );
                break;
            case constants.KEY_DISABLE:
                this.updatePriceText( this._priceTextPropsDisable );
                this.updatePriceImage( this._priceImagePropsDisable );
                break;
        }
    }

    updatePriceText(props:ComponentModel):void {
        Object.assign(this._priceText, props);
    }

    updatePriceImage(props:ComponentModel):void {
        Object.assign(this._priceImage, props);
    }

    setPrice( price: number ) : void {
        this._priceValue = price;
        this._priceText.text = price.toString();
    }

    getPrice() : number {
        return this._priceValue;
    }

    getPriceImage() : CSprite {
        return this._priceImage;
    }

    getPriceText() : CText {
        return this._priceText;
    }
}

