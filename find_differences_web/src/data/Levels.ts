import {URL_LEVELS} from "../constants/urls";

export class LevelModel {
    constructor(){}
    id: number;
    episode: number;
    x: number;
    y: number;
    picturesCount: number;
    differencesCount: number;
    time3stars: number;
    time2stars: number;
    time1stars: number;
}

export default class Levels {
    private static _levels : Array<LevelModel> = null;

    public static async load() {
        const loader: any = await fetch(URL_LEVELS);
        this._levels = await loader.json() as Array<LevelModel>;
    }

    public static getLevelByID( levelId: number ) : LevelModel {
        return this._levels.find( (level: LevelModel) => level.id === levelId );
    }
}