import {LevelModel} from "../models/ApiModels";

export default class Levels {
    private static _levels : Array<LevelModel> = null;

    public static load(levels:LevelModel[]) {
        // const loader: any = await Api.request(URL_LEVELS);
        // await loader.json() as Array<LevelModel>;
        this._levels = levels;
    }

    public static getLevelByID( levelId: number ) : LevelModel {
        return this._levels.find( (level: LevelModel) => level.id === levelId );
    }

    public static getLocationLevels( locationId: number ) : LevelModel[] {
        return this._levels
            .filter( (level: LevelModel) => level.location === locationId )
            .sort( (levelA:LevelModel, levelB:LevelModel) => levelA.id - levelB.id );
    }

    public static getNextLevel( levelData: LevelModel ) : LevelModel {
        const locationLevels:LevelModel[] = this.getLocationLevels(levelData.location);
        const levelIndex: number = locationLevels.findIndex( (level:LevelModel) => level.id == levelData.id );
        return levelIndex < locationLevels.length-1 ? locationLevels[levelIndex+1] : levelData;
    }
}