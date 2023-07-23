import * as PIXI from 'pixi.js';
import ExpProgressBar from "../components/ExpProgressBar";
import Map from "../components/Map";
import Properties from "../../data/Properties";
import CSlice9 from "../../components/CSlice9";
import CContainer from "../../components/CContainer";
import * as constants from "../../constants/constants";
import BalanceBar from "../components/BalanceBar";
import CButton from "../../components/CButton";
import Sounds from "../../data/Sounds";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import User from "../../data/User";

export class SceneLobby extends CContainer {
    private _expProgressBar : ExpProgressBar;
    private _balanceBar : BalanceBar;
    private _soundOnBtn : CButton;
    private _soundOffBtn : CButton;
    private _playNowBtn : CButton;
    private _map : Map;

    constructor() {
        super(Properties.get("sceneLobby"));

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");
        this._playNowBtn = this.getComponentByName("playNowBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._playNowBtn.setActionUp( this.onPlayNowClick.bind(this) );
        this.updateSoundBtn();
    }

    init() : void {
        // this._map = new Map( this._properties["map"] );
        this._map.initMap();
    }

    getNewComponentByName( props: any ): any {

        const name: string = props[constants.KEY_NAME];

        if ( name ) {
            switch ( name ) {
                case "map":
                    this._map = new Map(props);
                    return this._map;
                case "expProgressBar":
                    this._expProgressBar = new ExpProgressBar(props);
                    return this._expProgressBar;
                case "balanceBar":
                    this._balanceBar = new BalanceBar(props);
                    return this._balanceBar;
            }
        }

        return null;
    }

    updateSoundBtn() : void {
        this._soundOnBtn.visible = Sounds.isAudioAllowed();
        this._soundOffBtn.visible = !Sounds.isAudioAllowed();
    }

    onSoundSwitch(btn:any) : void {
        Sounds.setAllowAudio(!Sounds.isAudioAllowed());
        this.updateSoundBtn();
    }

    onPlayNowClick() : void {
        EventBus.publish( events.EVENT_ON_LEVEL_START, User.level );
    }
}
