import Map from "./Map";
import {MapModel} from "../../../models/PropertiesModels";
import {CampaignModel, LevelModel} from "../../../models/ApiModels";
import * as levelUtils from "../../../utils/LevelsUtils";

export default class CampaignMap extends Map {
    private _campaignData: CampaignModel;
    constructor(props:MapModel) {
        super(props);
    }

    public setCampaignData(campaignData: CampaignModel): void {
        this._campaignData = campaignData;
    }

    protected override getCurrentUserLevel(): number {
        return this._campaignData.level;
    }

    protected getLevelData(levelId:number): LevelModel {
        return levelUtils.getLevelByID(this._campaignData.levels, levelId);
    }

    protected setFences() {}
    protected addClouds() {}
    protected addMapDragging() {}
    protected scrollMapToCurrentLevel(animate?: boolean) {}
}