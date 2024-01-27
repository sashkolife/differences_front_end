import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import CContainer from "../../components/CContainer";
import ButtonPay from "../components/common/ButtonPay";
import Localization from "../../data/Localization";

export default class TrophySellWindow extends BaseWindow {
    private _trophy: CContainer;
    private _descriptorText: CBMText;
    private _trophyNameText: CBMText;
    private _btnSell: ButtonPay;
    private _btnNo: CButton;
    private _btnClose: CButton;

    private _sellClick: boolean = false;

    constructor() {
        super();
        this._trophy = this._content.getComponentByName("trophy");
        this._descriptorText = this._content.getComponentByName("descriptorText");
        this._trophyNameText = this._content.getComponentByName("trophyNameText");

        this._btnSell = this._content.getComponentByName("btnSell");
        this._btnSell.setActionUp( this.onSellClick.bind(this) );
        this._btnNo = this._content.getComponentByName("btnNo");
        this._btnNo.setActionUp( this.onCloseClick.bind(this) );
        this._btnClose = this._content.getComponentByName("closeBtn");
        this._btnClose.setActionUp( this.onCloseClick.bind(this) );

    }

    public show(params?: any) {
        super.show(params);

        this._trophyNameText.text = Localization.get("trophy_name_"+params.trophyId).toUpperCase();

        this._btnSell.setPrice(params.sellPrice);

        const trophy: CSprite = this._trophy.getComponentByName("trophy"+params.trophyId);
        trophy.visible = true;
    }

    public getName(): string {
        return super.getName()+"trophySell";
    }

    private onCloseClick() : void {
        this.hide();
    }

    private onSellClick() : void {
        this._sellClick = true;
        this.hide();
    }

    protected onHideComplete() {
        if (this._sellClick)
            this._params["onSellCallback"](this._params.trophyId);
        super.onHideComplete();
    }
}