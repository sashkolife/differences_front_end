import {Errors} from "./Enums";

export interface LevelModel {
    id: number;
    levelId: number;
    location: number;
    campaignId: number;
    picturesCount: number;
    differencesCount: number;
    complexity: number;
    time3stars: number;
    time2stars: number;
    time1stars: number;
    coins3stars: number;
    coins2stars: number;
    coins1stars: number;
    stars?: number;
    newStars?: number;
    isComplete?: number;
}

export interface LocationModel {
    id: number;
    name: string;
    lastLevelId: number;
    openNextStars: number;
    openNextCoins: number;
    openNextTime: number;
}

export interface ShopModel {
    id: number;
    androidProductId: string;
    coins: number;
    bonusPercentage: number;
    bonusValue: number;
    price: number;
    platformPrice: string;
}

export interface PlayedLevelModel {
    level: LevelModel;
    picture: LevelPictureModel;
    starsTime?: number;
    foundDifferences?: number[];
    helpDifferences?: number[];
}

export interface ConfigModel {
    helpPrice: number;
    extraTimePrice: number;
}

export interface LoginModel {
    user: UserModel;
    playedLevel?: PlayedLevelModel;
    config: ConfigModel;
    locations: LocationModel[];
    campaigns: CampaignModel[];
    levels: LevelModel[];
    shop: ShopModel[];
}

export interface OpenLocationModel {
    user: UserModel;
    error?: Errors;
}

export interface SellTrophyModel {
    user: UserModel;
    campaign: CampaignModel;
    error?: Errors;
}

export interface StartModel {
    user: UserModel;
    playedLevel?: PlayedLevelModel
    config?: ConfigModel
}

export interface UserModel {
    id?: number;
    level?: number;
    location?: number;
    coins?: number;
    helps?: number;
    playedLevelId?: number;
    playedCampaignId?: number;
    playedTime?: number;
    playedPictureId?: number;
    playedPictureNum?: number;
    playedMissCounter?: number;
    playedPenaltyTime?: number;
    playedPenaltyCounter?: number;
    penaltySeconds?: number;
    penaltyPrice?: number;
    registerDate?: number;
    lastBonusDate?: number;
    bonusDay?: number;
    deleted?: number;
    token?: string;
    nextLocationTimer?: number;
}

export interface LevelPictureModel {
    id: number;
    d: number;
    c: number;
    t: string;
    p: string;
    i1: string;
    i2: string;
    j: string;
    pictKey1?: string;
    pictKey2?: string;
    pictKeyJson?: string;
}

export interface LevelFindDiffModel {
    playedLevelId: number;
    playedPictureId: number;
    diffId: number;
    levelFinish?: LevelFinishModel;
    foundDifferences: number[];
    helpDifferences: number[];
    user: UserModel;
    picture?: LevelPictureModel;
    error?: Errors;
    campaign?: CampaignModel;
}

export interface HelpDiffModel {
    diffId: number;
    helpDifferences: number[];
    user: UserModel;
    error?: Errors;
}

export interface AddExtraTimeModel {
    addExtraTime: number;
    user: UserModel;
    error?: Errors;
}

export interface LevelFinishModel {
    spentTime?: number;
    stars?: number;
    coins?: number;
    helps?: number;
    userLevelId?: number;
    campaignId?: number;
    newCampaigns?: number[];
}

export interface PenaltySkipModel {
    user: UserModel;
    error?: Errors
}

export interface CampaignModel {
    id: number;
    name: string;
    startLevelId: number;
    level: number;
    isComplete: number;
    trophyId: number;
    trophyCoins: number;
    trophyHelps: number;
    trophyStars: number;
    trophySellCoins: number;
    isTrophy: number;
    isSold: number;
    levels: LevelModel[];
}

export interface TrophyTooltipModel {
    name: string;
    description: string;
}
