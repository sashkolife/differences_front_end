import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CSprite from "../../components/CSprite";
import CBMText from "../../components/CBMText";
import Localization from "../../data/Localization";
import {CampaignModel} from "../../models/ApiModels";
import CContainer from "../../components/CContainer";

export default class TrophyReceivedWindow extends BaseWindow {
    private _trophy: CContainer;
    private _rewardContainer: CContainer;
    private _descriptorText: CBMText;
    private _playBtn: CButton;
    private _closeBtn: CButton;

    private _campaignData: CampaignModel;

    constructor() {
        super();
        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );
        this._playBtn = this._content.getComponentByName("playBtn");
        this._playBtn.setActionUp( this.onCloseClick.bind(this) );

        this._trophy = this._content.getComponentByName("trophy");

        this._rewardContainer = this._content.getComponentByName("rewardContainer");

        this._descriptorText = this._content.getComponentByName("descriptorText");
    }

    public show(params?: any) {
        super.show(params);
        this._campaignData = params["campaignData"];
        this._descriptorText.text = Localization.replaceString(Localization.get(this._descriptorText.textKey), [Localization.get("trophy_name_"+this._campaignData.trophyId)]);

        const trophy: CSprite = this._trophy.getComponentByName("trophy"+this._campaignData.trophyId);
        trophy.visible = true;

        const coinsText = this._rewardContainer.getComponentByName("coinsWonText");
        coinsText.text = this._campaignData.trophyCoins.toString();

        const helpsText = this._rewardContainer.getComponentByName("helpsWonText");
        helpsText.text = this._campaignData.trophyHelps.toString();
    }

    public getName(): string {
        return super.getName()+"trophyReceived";
    }

    private onCloseClick() : void {
        this.hide();
    }

    protected onHideComplete() {
        this._params["onCloseCallback"]();
        super.onHideComplete();
    }
}