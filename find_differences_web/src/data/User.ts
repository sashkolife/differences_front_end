import * as urls from "../constants/Urls";

export class UserModel {
    constructor(){}
    id: number;
    level: number;
    coins: number;
    helps: number;
    playedLevelId: number;
    playedTime: number;
    playedPictureId: number;
    playedPictures: string;
    registerDate: number;
    lastBonusDate: number;
    bonusDay: number;
    deleted: number;
}

export class LevelModel {
    constructor(){}
    id: number;
    episode: number;
    x: number;
    y: number;
    picturesCount: number;
    differencesCount: number;
    time3stars: number;
    time2stars: number;
    time1stars: number;
}

export class UserLevelModel {
    constructor(){}
    levelId: number;
    stars: number;
}

export class ShopModel {
    constructor(){}
    androidProductId: string;
    coins: number;
}


export default class User {
    private static _shop : Array<ShopModel> = null;
    private static _levels : Array<LevelModel> = null;
    private static _data : UserModel = new UserModel();

    public static async loadUserData() {
        const loader = await fetch(urls.URL_LOGIN);
        this._data = await loader.json() as UserModel;
    }

    public static async loadLevels() {
        const loader = await fetch(urls.URL_LEVELS);
        this._levels = await loader.json() as Array<LevelModel>;
    }

    public static async loadShop() {
        const loader = await fetch(urls.URL_SHOP);
        this._shop = await loader.json() as Array<ShopModel>;
    }

}