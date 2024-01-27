import {ShopModel} from "../models/ApiModels";

export default class Shop {
    private static _shop : Array<ShopModel> = null;

    public static load(shop:ShopModel[]) {
        // const loader = await Api.request(urls.URL_SHOP);
        // this._shop = await loader.json() as Array<ShopModel>;
        this._shop = shop;
    }

    public static getShop(): ShopModel[] {
        return this._shop;
    }
}