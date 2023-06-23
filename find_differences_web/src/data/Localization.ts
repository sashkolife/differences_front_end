import {URL_JSON_LOCALIZATION_EN, URL_JSON_PROPERTIES} from "../constants/urls";

export default class Localization {
    private static _data : any = null;

    public static async load() {
        const loader: any = await fetch(URL_JSON_LOCALIZATION_EN);
        this._data = await loader.json();
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