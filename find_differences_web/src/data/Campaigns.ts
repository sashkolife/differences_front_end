import {CampaignModel} from "../models/ApiModels";

export default class Campaigns {
    private static _campaigns : CampaignModel[] = null;
    private static _newCampaignIds : number[] = null;

    public static load(campaigns:CampaignModel[]) {
        this._campaigns = campaigns;
    }

    public static getCampaigns() : CampaignModel[] {
        return this._campaigns;
    }

    public static initNewCampaigns( newCampaigns: number[] ): void {
        if (newCampaigns) {
            this._newCampaignIds = newCampaigns;
            for (let i: number = 0; i < newCampaigns.length; i++)
                for (let j: number = 0; j < this._campaigns.length; j++)
                    if (this._campaigns[j].id == newCampaigns[i]) {
                        this._campaigns[i].level = 1;
                        this._campaigns[i].isComplete = 0;
                    }
        }
    }

    public static getCampaignById(id: number): CampaignModel {
        return this._campaigns.find( (value: CampaignModel) => value.id == id );
    }

    public static getCampaignProgress(id: number): string {
        const campaign: CampaignModel = this.getCampaignById(id);
        const levelsLength: number = campaign.levels.length;
        const lastCompleteLevel: number = campaign.isComplete ? levelsLength : campaign.level-1;
        return lastCompleteLevel + "/" + levelsLength;
    }

    public static getNewCampaigns(): number[] {
        return this._newCampaignIds;
    }

    public static resetNewCampaigns(): void {
        this._newCampaignIds = null;
    }
}