import {URL_JSON_LOCALIZATION_EN, URL_JSON_LOCALIZATION_UK, URL_JSON_PROPERTIES} from "../constants/urls";
import Api from "../utils/Api";

export default class Localization {
    private static _data : any = null;

    public static async load() {
        const loader: any = await Api.request(URL_JSON_LOCALIZATION_EN);
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

    public static convertToHHMMSS(seconds:number):string {
        const s = seconds % 60;
        const m = Math.floor((seconds % 3600) / 60);
        const h = Math.floor(seconds / (60 * 60));
        const d = Math.floor(seconds / (24 * 60 * 60));

        if (d > 0) {
            return d + "d";
        }

        const hourStr = (h == 0) ? "" : this.doubleDigitFormat(h) + ":";
        const minuteStr = this.doubleDigitFormat(m) + ":";
        const secondsStr = this.doubleDigitFormat(s);

        return hourStr + minuteStr + secondsStr;
    }

    private static doubleDigitFormat(num:number) {
        if (num < 10) {
            return ("0" + num);
        }
        return num.toString();
    }
}