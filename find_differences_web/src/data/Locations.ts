import {LocationModel} from "../models/ApiModels";

export default class Locations {
    private static _locations : LocationModel[] = null;

    public static load(locs:LocationModel[]) {
        this._locations = locs;
    }

    public static getLocationByID( locId: number ) : LocationModel {
        return this._locations.find( (loc: LocationModel) => loc.id === locId );
    }
}