import * as urls from "../constants/urls";

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

export class UserLevelModel {
    constructor(){}
    levelId: number;
    stars: number;
}

export default class User {
    private static _data : UserModel = new UserModel();

    public static async load() {
        const loader = await fetch(urls.URL_LOGIN);
        this._data = await loader.json() as UserModel;
    }

}