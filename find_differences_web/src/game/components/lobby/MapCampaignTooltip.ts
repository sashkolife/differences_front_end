import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSprite from "../../../components/CSprite";
import Localization from "../../../data/Localization";
import {CampaignModel} from "../../../models/ApiModels";
import Campaigns from "../../../data/Campaigns";

export default class MapCampaignTooltip extends CContainer {
    private _campaignNameLabel: CText;
    private _progressLabel: CText;
    private _campaignData: CampaignModel;

    constructor( props: any ) {
        super( props );
        this._campaignNameLabel = this.getComponentByName("campaignNameLabel");
        this._progressLabel = this.getComponentByName("progressLabel");
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this);
        super.destroy(_options);
    }

    show( campaignData: CampaignModel ) : void {
        this._campaignData = campaignData;
        this._campaignNameLabel.text = Localization.get(campaignData.name);
        this._progressLabel.text = Campaigns.getCampaignProgress(campaignData.id);

        this.visible = true;
        this.alpha = 0;

        gsap.to( this, { duration: 0.05, "alpha": 1 } );
    }

    hide() : void {
        gsap.killTweensOf(this);
        this.visible = false;
    }
}
