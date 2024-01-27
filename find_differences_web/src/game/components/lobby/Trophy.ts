import CContainer from "../../../components/CContainer";
import {ContainerModel} from "../../../models/PropertiesModels";
import CSprite from "../../../components/CSprite";
import CButton from "../../../components/CButton";
import * as events from "../../../constants/events";
import EventBus from "../../../utils/EventBus";

export default class Trophy extends CContainer {
    private _notReceived: CSprite;
    private _received: CSprite;
    private _sold: CSprite;
    private _button: CButton;

    private _isRecieved: boolean = false;

    constructor(props:ContainerModel) {
        super(props);

        this._received = this.getComponentByName("received");
        this._notReceived = this.getComponentByName("notReceived");
        this._sold = this.getComponentByName("sold");

        this._button = this.getComponentByName("button");
        this._button.setActionOver(()=>EventBus.publish(events.EVENT_ON_TROPHY_OVER, this));
        this._button.setActionOut(()=>EventBus.publish(events.EVENT_ON_TROPHY_OUT, this));
        this._button.setActionUp(()=>EventBus.publish(events.EVENT_ON_TROPHY_CLICK, this));
    }

    setRecieved(value: boolean): void {
        this._isRecieved = value;
        this._received.visible = value;
    }

    setSold(value: boolean): void {
        this._sold.visible = value;
    }
}