import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import User from "../../data/User";
import ScreenBlock from "../components/common/ScreenBlock";

export default class OpenLocationWindow extends BaseWindow {
    private _key: CSprite;
    private _playBtn: CButton;
    private _closeBtn: CButton;

    private _isPlayNextClick: boolean = false;

    constructor() {
        super();
        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
        this._playBtn = this._content.getComponentByName("playBtn");
        this._playBtn.setActionUp( this.onPlayNextClick.bind(this) );
    }

    public show(params?: any) {
        super.show(params);
    }

    public getName(): string {
        return super.getName()+"openLocation";
    }

    private onCloseClick() : void {
        this.hide();
    }

    private onPlayNextClick() : void {
        this._isPlayNextClick = true;
        this.hide();
    }

    protected onHideComplete() {
        if ( this._isPlayNextClick ) {
            ScreenBlock.show();
            User.openLocation();
        }
        super.onHideComplete();
    }
}