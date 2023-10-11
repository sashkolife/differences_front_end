import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import {LevelModel, PenaltySkipModel, UserLevelModel, UserModel} from "../../models/ApiModels";
import ButtonPay from "../components/common/ButtonPay";
import Api from "../../utils/Api";
import {URL_LEVEL_FIND, URL_LEVEL_PENALTY_SKIP} from "../../constants/urls";
import ScreenBlock from "../components/common/ScreenBlock";
import User from "../../data/User";

export default class LevelPenaltyWindow extends BaseWindow {

    private _descriptorText1:CBMText;
    private _descriptorText2:CBMText;
    private _timeText:CBMText;

    private _btnPay:ButtonPay;

    private _seconds: number = 0;
    private _interval: any = null;

    constructor() {
        super();

        this._btnPay = this._content.getComponentByName("btnPay");
        this._descriptorText1 = this._content.getComponentByName("descriptorText1");
        this._descriptorText2 = this._content.getComponentByName("descriptorText2");
        this._timeText = this._content.getComponentByName("timeText");

        this._btnPay.setActionUp( this.onPayClick.bind(this) );
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
        this._seconds = params.penaltySeconds;
        this._timeText.text = Localization.convertToHHMMSS(this._seconds);
        this._btnPay.setPrice(params.penaltyPrice);

        this._interval = window.setInterval(()=> {
            this._seconds--;
            this._timeText.text = Localization.convertToHHMMSS(this._seconds);
            if ( this._seconds <= 0 ) {
                window.clearInterval(this._interval);
                this.hide();
            }
        }, 1000);
    }
}