import * as PIXI from 'pixi.js';
import {BaseWindow} from "./BaseWindow";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import {PenaltySkipModel, UserModel} from "../../models/ApiModels";
import ButtonPay from "../components/common/ButtonPay";
import Api from "../../utils/Api";
import { URL_LEVEL_PENALTY_SKIP} from "../../constants/urls";
import ScreenBlock from "../components/common/ScreenBlock";
import User from "../../data/User";

export default class LevelPenaltyWindow extends BaseWindow {

    private _descriptorText1:CBMText;
    private _descriptorText2:CBMText;
    private _timeText:CBMText;

    private _btnPay:ButtonPay;

    private _penaltyTimerEvent: EventModel = null;
    private _penaltyTimerEndEvent: EventModel = null;

    constructor() {
        super();

        this._btnPay = this._content.getComponentByName("btnPay");
        this._descriptorText1 = this._content.getComponentByName("descriptorText1");
        this._descriptorText2 = this._content.getComponentByName("descriptorText2");
        this._timeText = this._content.getComponentByName("timeText");

        this._btnPay.setActionUp( this.onPayClick.bind(this) );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        super.destroy(_options);
        this._penaltyTimerEvent.unsubscribe();
        this._penaltyTimerEvent = null;
        this._penaltyTimerEndEvent.unsubscribe();
        this._penaltyTimerEndEvent = null;
    }

    public getName(): string {
        return super.getName()+"levelPenalty";
    }

    private onPayClick() : void {
        this._btnPay.setEnabled(false);
        Api.request(URL_LEVEL_PENALTY_SKIP).then( async (loader: Response ) => {
            const obj: PenaltySkipModel = await loader.json();

            if ( !obj ) {
                ScreenBlock.show();
                return;
            }

            if ( obj.error ) {
                ScreenBlock.show();
                return;
            }

            if ( obj.user ) {
                User.update(obj.user);
                EventBus.publish(events.EVENT_ON_BALANCE_UPDATE, {coins:obj.user.coins});
                this.hide();
            }
        });
    }

    public show(params?: UserModel) {
        super.show(params);
        this._timeText.text = Localization.convertToHHMMSS(params.penaltySeconds);
        this._btnPay.setPrice(params.penaltyPrice);

        this._penaltyTimerEvent = EventBus.subscribe(events.EVENT_ON_PENALTY_TIMER_TICK, this.onPenaltyTimerTick.bind(this));
        this._penaltyTimerEndEvent = EventBus.subscribe(events.EVENT_ON_PENALTY_TIMER_END, this.onPenaltyTimerEnd.bind(this));
    }

    private onPenaltyTimerTick(seconds: number): void {
        this._timeText.text = Localization.convertToHHMMSS(seconds);
    }

    private onPenaltyTimerEnd(): void {
        this.hide();
    }
}