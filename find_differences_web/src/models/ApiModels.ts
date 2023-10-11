import {Errors} from "./Enums";

export interface LevelModel {
    id: number;
    location: number;
    picturesCount: number;
    differencesCount: number;
    complexity: number;
    time3stars: number;
    time2stars: number;
    time1stars: number;
    coins3stars: number;
    coins2stars: number;
    coins1stars: number;
}

export interface LocationModel {
    id: number;
    name: string;
    lastLevelId: number;
    openNextStars: number;
    openNextPrice: number;
    openNextTime: number;
}

export interface ShopModel {
    androidProductId: string;
    coins: number;
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
    levels: LevelModel[];
    shop: ShopModel[];
}

export interface OpenLocationModel {
    user: UserModel;
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
    levels?: UserLevelModel[];
    token?: string;
    nextLocationTimer?: number;
}

export interface UserLevelModel {
    levelId: number;
    stars: number;
    newStars?: number;
    isComplete?: number;
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
    error?: Errors
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
}

export interface PenaltySkipModel {
    user: UserModel;
    error?: Errors
}