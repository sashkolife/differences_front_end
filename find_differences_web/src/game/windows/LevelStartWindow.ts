import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import {LevelModel} from "../../models/ApiModels";

export default class LevelStartWindow extends BaseWindow {

    private _closeBtn:CButton;
    private _playBtn:CButton;

    private _fillStars:Array<CSprite>;

    private _headerText:CBMText;
    private _picturesText:CBMText;
    private _differencesText:CBMText;

    private _needTime0:CBMText;
    private _needTime1:CBMText;
    private _needTime2:CBMText;

    constructor() {
        super();

        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._playBtn = this._content.getComponentByName("playBtn");

        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
        this._playBtn.setActionUp( this.onPlayClick.bind(this) );

        this._fillStars = [
            this._content.getComponentByName("fillStar0"),
            this._content.getComponentByName("fillStar1"),
            this._content.getComponentByName("fillStar2")
        ];

        this._headerText = this._content.getComponentByName("headerText");
        this._picturesText = this._content.getComponentByName("picturesText");
        this._differencesText = this._content.getComponentByName("differencesText");

        this._needTime0 = this._content.getComponentByName("needTime0");
        this._needTime1 = this._content.getComponentByName("needTime1");
        this._needTime2 = this._content.getComponentByName("needTime2");
    }

    public getName(): string {
        return super.getName()+"levelStart";
    }

    private onCloseClick() : void {
        this.hide();
    }

    private onPlayClick() : void {
        this.hide();
        const levelData:LevelModel = this._params["levelData"];
        EventBus.publish( events.EVENT_ON_LEVEL_START, levelData );
    }

    public show(params?: any) {
        super.show(params);
        const levelData:LevelModel = this._params["levelData"];
        this._headerText.text = Localization.get("window_play_header") + " " + levelData.id;
        this._picturesText.text = Localization.get("window_play_pictures") + " " + levelData.picturesCount;
        this._differencesText.text = Localization.get("window_play_differences") + " " + levelData.differencesCount;

        this._needTime0.text = Localization.convertToHHMMSS(levelData.time3stars);
        this._needTime1.text = Localization.convertToHHMMSS(levelData.time2stars);
        this._needTime2.text = Localization.convertToHHMMSS(levelData.time1stars);

        if ( levelData.stars ) {
            for (let i: number = 0; i < levelData.stars; i++) {
                this._fillStars[i].visible = true;
            }
        }
    }
}