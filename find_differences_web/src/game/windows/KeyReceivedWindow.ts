import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";

export default class KeyReceivedWindow extends BaseWindow {
    private _key: CSprite;
    private _descriptorText: CBMText;
    private _playBtn: CButton;
    private _closeBtn: CButton;

    private _onCloseCallback: Function;

    constructor() {
        super();
        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
        this._playBtn = this._content.getComponentByName("playBtn");
        this._playBtn.setActionUp( this.onCloseClick.bind(this) );

        this._key = this._content.getComponentByName("key");
        this._descriptorText = this._content.getComponentByName("descriptorText");
    }

    public show(params?: any) {
        super.show(params);
        this._descriptorText.text = Localization.replaceString(Localization.get(this._descriptorText.textKey), [params["stars"]]);
    }

    public getName(): string {
        return super.getName()+"keyReceived";
    }

    private onCloseClick() : void {
        this.hide();
    }

    protected onHideComplete() {
        this._params["onCloseCallback"]();
        super.onHideComplete();
    }
}