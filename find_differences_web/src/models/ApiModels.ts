
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

export interface ShopModel {
    androidProductId: string;
    coins: number;
}

export interface PlayedLevelModel {
    level: LevelModel;
    picture: LevelPictureModel;
    foundDifferences?: number[];
}

export interface StartModel {
    user: UserModel;
    playedLevel?: PlayedLevelModel
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
    registerDate?: number;
    lastBonusDate?: number;
    bonusDay?: number;
    deleted?: number;
    levels?: UserLevelModel[];
    token?: string;
}

export interface UserLevelModel {
    levelId: number;
    stars: number;
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
    isWin?: boolean;
    coins?: number;
    stars?: number;
    timeDiff?: number;
    foundDifferences: number[];
    user: UserModel;
    picture?: LevelPictureModel;
    error?: Errors
}

export enum Errors {
    DIFFERENCE_IS_OUT = "error_difference_is_out",
    USER_HAVE_PENALTY = "error_user_have_penalty"
}