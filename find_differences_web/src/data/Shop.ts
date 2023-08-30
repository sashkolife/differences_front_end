import {URL_LEVELS} from "../constants/urls";
import * as urls from "../constants/urls";
import {ShopModel} from "../models/ApiModels";
import Api from "../utils/Api";

export default class Shop {
    private static _shop : Array<ShopModel> = null;

    public static async load() {
        const loader = await Api.request(urls.URL_SHOP);
        this._shop = await loader.json() as Array<ShopModel>;
    }
}