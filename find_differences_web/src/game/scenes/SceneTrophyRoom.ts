import CContainer from "../../components/CContainer";
import Properties from "../../data/Properties";
import CButton from "../../components/CButton";
import BalanceBar from "../components/common/BalanceBar";
import Sounds from "../../data/Sounds";
import {CampaignModel, SellTrophyModel} from "../../models/ApiModels";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import CSprite from "../../components/CSprite";
import Trophy from "../components/lobby/Trophy";
import * as constants from "../../constants/constants";
import Campaigns from "../../data/Campaigns";
import TrophyTooltip from "../components/lobby/TrophyTooltip";
import Localization from "../../data/Localization";
import * as PIXI from "pixi.js";
import WindowsController from "../windows/WindowsController";
import LevelFinishWindow from "../windows/LevelFinishWindow";
import TrophySellWindow from "../windows/TrophySellWindow";
import User from "../../data/User";
import {SceneBase} from "./SceneBase";

export class SceneTrophyRoom extends SceneBase {

    private _background: CSprite;
    private _balanceBar: BalanceBar;
    private _soundOnBtn: CButton;
    private _soundOffBtn: CButton;
    private _leaveBtn: CButton;
    private _trophyTooltip: TrophyTooltip;
    private _trophies: Trophy[];

    private _trophyOverSubscription:EventModel = null;
    private _trophyOutSubscription:EventModel = null;
    private _trophyClickSubscription:EventModel = null;

    constructor() {
        super(Properties.get("sceneTrophyRoom"));

        this._background = this.getComponentByName("background");
        this._background.load();

        this._trophies = this.getComponentsByType(constants.COMPONENT_TROPHY);
        this.initTrophies();

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this.updateSoundBtn();

        this._leaveBtn = this.getComponentByName("leaveBtn");
        this._leaveBtn.setActionUp( this.onLeaveTouch.bind(this) );

        this._trophyTooltip = this.getComponentByName("trophyTooltip");
        this._trophyOverSubscription = EventBus.subscribe(events.EVENT_ON_TROPHY_OVER, this.onTrophyOver.bind(this));
        this._trophyOutSubscription = EventBus.subscribe(events.EVENT_ON_TROPHY_OUT, this.onTrophyOut.bind(this));
        this._trophyClickSubscription = EventBus.subscribe(events.EVENT_ON_TROPHY_CLICK, this.onTrophyClick.bind(this));
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this._trophyOverSubscription.unsubscribe();
        this._trophyOutSubscription.unsubscribe();
        super.destroy(_options);
    }

    private initTrophies() : void {
        const userCampaigns: CampaignModel[] = Campaigns.getCampaigns();
        userCampaigns.map(campaign => {
            const trophy: Trophy = this.getTrophyById(campaign.trophyId);
            if (campaign.isTrophy == 1) {
                trophy.setRecieved(true);
            }
            if (campaign.isSold == 1) {
                trophy.setSold(true);
            }
        })
    }

    private getTrophyById(trophyId: number): Trophy {
        return this._trophies.find(trophy => trophy.properties.id == trophyId);
    }

    public getNewComponentByType( props: any ) : any {
        if (props.type == constants.COMPONENT_BALANCE_BAR) {
            return new BalanceBar(props);
        }
        if (props.type == constants.COMPONENT_TROPHY) {
            return new Trophy(props);
        }
        if (props.type == constants.COMPONENT_TROPHY_TOOLTIP) {
            return new TrophyTooltip(props);
        }
        return super.getNewComponentByType(props);
    }

    private updateSoundBtn() : void {
        this._soundOnBtn.visible = Sounds.isAudioAllowed();
        this._soundOffBtn.visible = !Sounds.isAudioAllowed();
    }

    private onSoundSwitch(btn:any) : void {
        Sounds.setAllowAudio(!Sounds.isAudioAllowed());
        this.updateSoundBtn();
    }

    private onLeaveTouch(): void {
        EventBus.publish(events.EVENT_ON_LEVEL_LEAVE);
    }

    private onTrophyOver(trophy: Trophy): void {
        this._trophyTooltip.show(trophy);
    }

    private onTrophyOut(trophy: Trophy): void {
        this._trophyTooltip.hide();
    }

    private onTrophyClick(trophy: Trophy): void {
        const campaign: CampaignModel = Campaigns.getCampaignById(trophy.properties.id);
        if (campaign.isSold === 0 && campaign.isTrophy === 1) {
            WindowsController.instance().show(TrophySellWindow, {
                "sellPrice": campaign.trophySellCoins,
                "trophyId": campaign.trophyId,
                "onSellCallback": async () => {
                    const data: SellTrophyModel = await User.sellTrophy(campaign.id);
                    if (data) {
                        campaign.isSold = 1;
                        trophy.setSold(true);
                        EventBus.publish(events.EVENT_ON_BALANCE_UPDATE, {coins:data.user.coins});
                    }
                }
            });
        }
    }
}
