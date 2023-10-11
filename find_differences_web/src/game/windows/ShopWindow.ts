import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";

export default class ShopWindow extends BaseWindow {
    private _closeBtn:CButton;

    constructor() {
        super();
        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
    }

    public getName(): string {
        return super.getName()+"shop";
    }

    private onCloseClick() : void {
        this.hide();
    }
}