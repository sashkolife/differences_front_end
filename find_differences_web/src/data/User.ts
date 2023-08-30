import * as urls from "../constants/urls";
import {StartModel, PlayedLevelModel, UserLevelModel, UserModel} from "../models/ApiModels";
import Api from "../utils/Api";

export default class User {
    private static _startData : StartModel;
    private static _data : UserModel;

    public static async load() {
        let id: string = null;
        try {
            id = window.localStorage.getItem("userId");
        } catch (err) {
            console.log("Get local store userId Error", err);
        }

        const loader: Response = await Api.request(urls.URL_LOGIN+(id||""));
        const loginData : StartModel = await loader.json() as StartModel;
        this._startData = loginData;
        this._data = loginData.user;

        try {
            window.localStorage.setItem("userId", this._data.id.toString() );
        } catch (err) {
            console.log("Set local store userId Error", err);
        }
    }

    public static update( data: UserModel ) : void {
        if ( data ) {
            Object.assign(this._data, data);
        }
    }

    public static get level() : number {
        return this._data.level;
    }

    public static get location() : number {
        return this._data.location;
    }

    public static get balance() : number {
        return this._data.helps;
    }

    public static get token() : string {
        return this._data?.token;
    }

    public static getUserLevelByID( levelId: number ) : UserLevelModel {
        return this._data.levels ? this._data.levels.find( (level: UserLevelModel) => level.levelId === levelId ) : null;
    }

    public static get playedPictureNum() : number {
        return this._data.playedPictureNum;
    }

    public static get playedLevel() : PlayedLevelModel {
        return this._startData.playedLevel;
    }

    public static removePlayedLevel() : void {
        this._startData.playedLevel = null;
    }
}