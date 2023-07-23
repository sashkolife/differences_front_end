
export class LevelModel {
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

export class ShopModel {
    androidProductId: string;
    coins: number;
}

export class UserModel {
    id: number;
    level: number;
    location: number;
    coins: number;
    helps: number;
    playedLevelId: number;
    playedTime: number;
    playedPictureId: number;
    playedPictureNum: number;
    registerDate: number;
    lastBonusDate: number;
    bonusDay: number;
    deleted: number;
    levels: Array<UserLevelModel>;
    token: string;
}

export class UserLevelModel {
    levelId: number;
    stars: number = 0;
}

export class LevelStartModel {
    user: any;
    level: any;
    picture: LevelPictureModel;
}

export class LevelPictureModel {
    id: number;
    d: number;
    c: number;
    t: string;
    p: string;
    i1: string;
    i2: string;
    j: string;
    pictKey1: string;
    pictKey2: string;
    pictKeyJson: string;
}
