import * as PIXI from 'pixi.js';
import CContainer from "../../../components/CContainer";
import CBMText from "../../../components/CBMText";
import CButton from "../../../components/CButton";
import User from "../../../data/User";
import WindowsController from "../../windows/WindowsController";
import {ContainerModel} from "../../../models/PropertiesModels";
import EventBus, {EventModel} from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import {BalanceUpdateEvent} from "../../../models/EventModels";

export default class BalanceBar extends CContainer {
    private _balanceValue: CBMText;
    private _plusButton: CButton

    private _balanceUpdateSubscription:EventModel;

    constructor( props: ContainerModel ) {
        super( props );

        this._balanceValue = this.getComponentByName("balanceValue");
        this._plusButton = this.getComponentByName("plusButton");
        this._plusButton.setActionUp( this.onPlusClick.bind(this) );

        this._balanceValue.text = User.balance.toString();
        this._balanceUpdateSubscription = EventBus.subscribe(events.EVENT_ON_BALANCE_UPDATE, this.onBalanceUpdate.bind(this));
    }

    private onPlusClick() : void {
        //WindowsController.instance().show();
    }

    private onBalanceUpdate( event:BalanceUpdateEvent ) : void {
        if ( event.isAnimate === true ) {

        } else {
            this._balanceValue.text = User.balance.toString();
        }
    }
}

