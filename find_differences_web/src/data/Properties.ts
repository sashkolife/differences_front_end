import {URL_JSON_PROPERTIES} from "../constants/urls";

export default class Properties {
    private static _data : any = null;

    public static async load() {
        const loader: any = await fetch(URL_JSON_PROPERTIES);
        this._data = await loader.json();
    }

    public static get( key: string ) : any {
        return this._data[key];
    }
}