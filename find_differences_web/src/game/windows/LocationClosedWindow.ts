import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import ButtonPay from "../components/common/ButtonPay";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import User from "../../data/User";
import WindowsController from "./WindowsController";
import OpenLocationWindow from "./OpenLocationWindow";
import Api from "../../utils/Api";
import * as urls from "../../constants/urls";
import {OpenLocationModel} from "../../models/ApiModels";
import ScreenBlock from "../components/common/ScreenBlock";
import * as PIXI from "pixi.js";

export default class LocationClosedWindow extends BaseWindow {
    private _starsText: CBMText;
    private _timerText: CBMText;
    private _payBtn: ButtonPay;
    private _closeBtn: CButton;

    private _isPlayNextClick: boolean = false;

    private _openTimerEvent: EventModel = null;

    constructor() {
        super();
        this._starsText = this._content.getComponentByName("starsText");
        this._timerText = this._content.getComponentByName("timerText");
        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
        this._payBtn = this._content.getComponentByName("payBtn");
        this._payBtn.setActionUp( this.onBuyNextClick.bind(this) );

        this._openTimerEvent = EventBus.subscribe(events.EVENT_ON_LOCATION_OPEN_TIMER_TICK, this.onOpenTimerTick.bind(this));
    }

    public show(params?: any) {
        super.show(params);
        console.log(params);
        this._payBtn.setPrice( params["price"] );
        this._starsText.text = Localization.replaceString(Localization.get(this._starsText.textKey), [params["stars"]]);
    }

    public getName(): string {
        return super.getName()+"locationClosed";
    }

    private onCloseClick() : void {
        this.hide();
    }

    private onBuyNextClick() : void {
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

    private onOpenTimerTick(ms: number): void {
        if ( ms > 0 ) {
            this._timerText.text = Localization.convertToHHMMSS(ms/1000);
        } else {
            this.hide();
            WindowsController.instance().show(OpenLocationWindow, null);
        }
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this._openTimerEvent.unsubscribe();
        this._openTimerEvent = null;
        super.destroy(_options);
    }
}