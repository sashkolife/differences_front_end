import * as PIXI from 'pixi.js';
import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import {LevelFinishModel, LevelModel} from "../../models/ApiModels";
import CContainer from "../../components/CContainer";
import ThreeStateStar from "../components/common/ThreeStateStar";
import {ComponentModel, ContentWindowModel} from "../../models/PropertiesModels";
import {COMPONENT_THREE_STATE_STAR} from "../../constants/constants";
import {WindowContent} from "./WindowContent";
import * as constants from "../../constants/constants";

export default class LevelFinishWindow extends BaseWindow {

    private _closeBtn:CButton;
    private _playNextBtn:CButton;
    private _playAgainBtn:CButton;

    private _stars:Array<ThreeStateStar>;

    private _congratulationText:CBMText;
    private _levelNumText:CBMText;
    private _descriptorText:CBMText;
    private _spentTimeText:CBMText;
    private _rewardText:CBMText;
    private _rewardContainer:CContainer;
    private _coinsWonText:CBMText;
    private _coinsWonImage:CSprite;
    private _helpsWonText:CBMText;
    private _helpsWonImage:CSprite;

    private _isCloseClick:boolean = false;

    private _levelData:LevelModel = null;
    private _nextLevelData:LevelModel = null;
    private _levelFinish:LevelFinishModel = null;

    private _starsTimeouts: any[];

    constructor() {
        super();

        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._playNextBtn = this._content.getComponentByName("playNextBtn");
        this._playAgainBtn = this._content.getComponentByName("playAgainBtn");

        this._levelNumText = this._content.getComponentByName("levelNumText");
        this._congratulationText = this._content.getComponentByName("congratulationText");
        this._descriptorText = this._content.getComponentByName("descriptorText");
        this._spentTimeText = this._content.getComponentByName("spentTimeText");
        this._rewardText = this._content.getComponentByName("yourRewardText");
        this._rewardContainer = this._content.getComponentByName("rewardContainer");
        this._coinsWonText = this._rewardContainer.getComponentByName("coinsWonText");
        this._helpsWonText = this._rewardContainer.getComponentByName("helpsWonText");

        this._stars = [
            this._content.getComponentByName("star0"),
            this._content.getComponentByName("star1"),
            this._content.getComponentByName("star2")
        ];

        this._coinsWonImage = this._rewardContainer.getComponentByName("coinsWonImage");
        this._helpsWonImage = this._rewardContainer.getComponentByName("helpsWonImage");

        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
        this._playAgainBtn.setActionUp( this.onPlayAgainClick.bind(this) );
        this._playNextBtn.setActionUp( this.onPlayNextClick.bind(this) );
    }

    public getName(): string {
        return super.getName()+"levelFinish";
    }

    override getNewComponentByType( props:ComponentModel ) : any {
        if ( props.type === constants.COMPONENT_WINDOW_CONTENT ) {
            return new LevelFinishContent( props as ContentWindowModel );
        }
        return super.getNewComponentByType( props );
    }

    private onCloseClick() : void {
        this._isCloseClick = true;
        this.hide();
    }

    private onPlayAgainClick() : void {
        this.hide();
        EventBus.publish( events.EVENT_ON_LEVEL_START, this._levelData );
    }

    private onPlayNextClick() : void {
        this.hide();
        EventBus.publish( events.EVENT_ON_LEVEL_START, this._nextLevelData );
    }

    public show(params?: any) {
        super.show(params);
        this._levelData = this._params["levelData"];
        this._levelFinish = this._params["levelFinish"];
        this._nextLevelData = this._params["nextLevelData"];

        this.setPlayNextButton();

        this._levelNumText.text = Localization.get("window_play_header") + " " + this._levelData.id;
        this._descriptorText.text = Localization.replaceString(Localization.get(this._descriptorText.textKey), [this._levelData.picturesCount, this._levelData.differencesCount]);
        this._spentTimeText.text = Localization.replaceString(Localization.get(this._spentTimeText.textKey),  [Localization.convertToHHMMSS(this._levelFinish.spentTime)]);

        const rewardCoins: number = this._levelFinish.coins ? this._levelFinish.coins : 0;
        const rewardHelps: number = this._levelFinish.helps ? this._levelFinish.helps : 0;
        if ( rewardCoins > 0 || rewardHelps > 0 ) {

            this._rewardText.visible = true;
            this._rewardContainer.visible = true;

            if ( rewardCoins > 0 ) {
                this._coinsWonText.visible = true;
                this._coinsWonImage.visible = true;
                this._coinsWonText.text = this._levelFinish.coins.toString();
            }

            if ( rewardHelps > 0) {
                this._helpsWonText.visible = true;
                this._helpsWonImage.visible = true;
                this._helpsWonText.text = this._levelFinish.helps.toString();
                if ( rewardCoins > 0  ) {
                    this._helpsWonImage.x = 100;
                    this._helpsWonText.x = 130;
                }
            }

            this._rewardContainer.x = -this._rewardContainer.getBounds().width/2;
        }
    }

    private setPlayNextButton(): void {
        if ( this._levelData.id === this._nextLevelData.id || this._params.levelFinish.newCampaigns || this._params.isCampaignTrophy === true ) {
            this._playNextBtn.visible = false;
        }
    }

    protected onHideComplete():void {
        super.onHideComplete();
        if ( this._isCloseClick ) {
            EventBus.publish(events.EVENT_ON_LEVEL_LEAVE);
        }
    }

    protected onShowComplete():void {
        super.onShowComplete();

        if ( this._levelFinish.stars && this._levelFinish.stars > 0 ) {
            this._starsTimeouts = [];
            for ( let i: number = 0; i < this._levelFinish.stars; i++ ) {
                this._starsTimeouts.push(
                    setTimeout( (star:ThreeStateStar) => {
                        star.setFull(true);
                    }, 100+200*i, this._stars[i] )
                );
            }
        }

        if ( this._levelFinish.coins && this._levelFinish.coins > 0 ) {
            EventBus.publish(events.EVENT_ON_BALANCE_UPDATE, {coins:this._levelFinish.coins});
        }
    }

    private stopStarsTimeouts(): void {
        if ( this._starsTimeouts ) {
            this._starsTimeouts.forEach( timeout => clearTimeout(timeout) );
            this._starsTimeouts = null;
        }
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this.stopStarsTimeouts();
        super.destroy(_options);
    }
}

class LevelFinishContent extends WindowContent {

    constructor( props: ContentWindowModel ) {
        super( props );
    }

    override getNewComponentByType(props: ComponentModel): any {
        if ( props.type === COMPONENT_THREE_STATE_STAR ) {
            return new ThreeStateStar(props);
        }
        return super.getNewComponentByType(props);
    }
}