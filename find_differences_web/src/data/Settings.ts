import {URL_JSON_SETTINGS} from "../constants/Urls";

export default class Settings {
    private static _data : any = null;

    public static async load() {
        this._data = await fetch(URL_JSON_SETTINGS);
    }

    public static get( key: string ) : any {
        return this._data[key];
    }
}