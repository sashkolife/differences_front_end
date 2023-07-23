import {URL_LEVELS} from "../constants/urls";
import * as urls from "../constants/urls";
import {ShopModel} from "./models";

export default class Shop {
    private static _shop : Array<ShopModel> = null;

    public static async load() {
        const loader = await fetch(urls.URL_SHOP);
        this._shop = await loader.json() as Array<ShopModel>;
    }
}