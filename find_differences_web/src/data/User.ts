import * as urls from "../constants/urls";
import {UserLevelModel, UserModel} from "./models";

export default class User {
    private static _data : UserModel = new UserModel();

    public static async load() {
        let id: string = null;
        try {
            id = window.localStorage.getItem("userId");
        } catch (err) {
            console.log("Get local store userId Error", err);
        }

        const loader: Response = await fetch(urls.URL_LOGIN+(id||""));
        this._data = await loader.json() as UserModel;

        try {
            window.localStorage.setItem("userId", this._data.id.toString() );
        } catch (err) {
            console.log("Set local store userId Error", err);
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
        return this._data.token;
    }

    public static getUserLevelByID( levelId: number ) : UserLevelModel {
        return this._data.levels ? this._data.levels.find( (level: UserLevelModel) => level.levelId === levelId ) : null;
    }

}