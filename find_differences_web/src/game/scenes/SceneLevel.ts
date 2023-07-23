import * as PIXI from 'pixi.js';
import CContainer from "../../components/CContainer";
import Properties from "../../data/Properties";
import BalanceBar from "../components/BalanceBar";
import CButton from "../../components/CButton";
import Sounds from "../../data/Sounds";
import * as constants from "../../constants/constants";
import PicturesProgressBar from "../components/PicturesProgressBar";
import DifferencesProgressBar from "../components/DifferencesProgressBar";
import CBMText from "../../components/CBMText";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import {LevelStartModel} from "../../data/models";
import LevelPicturesContainer from "../components/LevelPicturesContainer";

export class SceneLevel extends CContainer {

    private _levelPicturesContainer : LevelPicturesContainer;
    private _picturesProgressBar : PicturesProgressBar;
    private _differencesProgressBar : DifferencesProgressBar;
    private _balanceBar : BalanceBar;
    private _soundOnBtn : CButton;
    private _soundOffBtn : CButton;
    private _levelText : CBMText;
    private _leaveBtn : CButton;

    private _levelId:number;

    constructor(private _levelData: LevelStartModel ) {

        super(Properties.get("sceneLevel"));

        this._levelId = _levelData.level.id;

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this.updateSoundBtn();

        this._levelText = this.getComponentByName("levelText");

        this._leaveBtn = this.getComponentByName("leaveBtn");
        this._leaveBtn.setActionUp( this.onLeaveClick.bind(this) );

        this._differencesProgressBar.setCount(6);
        this._picturesProgressBar.setCount(6);

        this._levelPicturesContainer.init( _levelData.picture );
    }

    init() : void {
    }

    getNewComponentByName( props: any ): any {

        const name: string = props[constants.KEY_NAME];

        if ( name ) {
            switch ( name ) {
                case "levelPicturesContainer":
                    this._levelPicturesContainer = new LevelPicturesContainer(props);
                    return this._levelPicturesContainer;
                case "picturesProgressBar":
                    this._picturesProgressBar = new PicturesProgressBar(props);
                    return this._picturesProgressBar;
                case "differencesProgressBar":
                    this._differencesProgressBar = new DifferencesProgressBar(props);
                    return this._differencesProgressBar;
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

    onLeaveClick(): void {
        EventBus.publish( events.EVENT_ON_LEVEL_LEAVE );
    }
}
