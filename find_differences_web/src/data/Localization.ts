import {URL_JSON_LOCALIZATION_EN} from "../constants/Urls";

export default class Localization {
    private static _data : any = null;

    public static async load() {
        this._data = await fetch(URL_JSON_LOCALIZATION_EN);
    }

    public static get( key: string ) : string {
        return this._data[key]||key;
    }

    public static replaceString( str: string, data: any ) : string {
        if ( data ) {
            for ( let k in data ) {
                str = str.replace("{" + k + "}", data[k]);
            }
        }
        return str;
    }
}