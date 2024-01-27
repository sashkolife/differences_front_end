import CText from "../../../components/CText";
import Localization from "../../../data/Localization";
import {CampaignModel} from "../../../models/ApiModels";
import Campaigns from "../../../data/Campaigns";
import Tooltip from "../common/Tooltip";

export default class MapCampaignTooltip extends Tooltip {
    private _campaignNameLabel: CText;
    private _progressLabel: CText;
    private _campaignData: CampaignModel;

    constructor( props: any ) {
        super( props );
        this._campaignNameLabel = this.getComponentByName("campaignNameLabel");
        this._progressLabel = this.getComponentByName("progressLabel");
    }

    show( campaignData: CampaignModel ) : void {
        this._campaignData = campaignData;
        this._campaignNameLabel.text = Localization.get(campaignData.name);
        this._progressLabel.text = Campaigns.getCampaignProgress(campaignData.id);

        super.show();
    }
}
