import {LevelModel} from "../models/ApiModels";

export const getLevelByID = ( levels:LevelModel[], levelId: number ) : LevelModel => {
    return levels.find( (level: LevelModel) => level.id === levelId );
}

export const getLocationLevels = ( levels:LevelModel[], locationId?: number ) : LevelModel[] => {
    const locLevels: LevelModel[] = locationId >= 0 ? levels.filter( level => level.location === locationId ) : levels;
    return locLevels.sort( (levelA, levelB) => levelA.id - levelB.id );
}

export const getNextLevel = ( levels:LevelModel[], levelData: LevelModel ) : LevelModel => {
    const locationLevels:LevelModel[] = getLocationLevels(levels, levelData.location);
    const levelIndex: number = locationLevels.findIndex( level => level.id == levelData.id );
    return levelIndex < locationLevels.length-1 ? locationLevels[levelIndex+1] : levelData;
}

export const isLastLocationLevelComplete = (levels:LevelModel[], locationId:number) : boolean => {
    const locationLevels: LevelModel[] = getLocationLevels(levels, locationId);//this._user.location
    const lastLevel: LevelModel = locationLevels[locationLevels.length-1];
    return lastLevel.isComplete === 1;
}

export const getLocationStars = (levels:LevelModel[], locationId?:number): number => {
    const locationLevels: LevelModel[] = getLocationLevels(levels, locationId);//this._user.location
    let stars: number = 0;
    locationLevels.forEach( (locLevel: LevelModel) => {
        if ( locLevel.stars ) {
            stars += locLevel.stars;
        }
    } );
    return stars;
}

export const getUpdatedLevels = (levels:LevelModel[]) : LevelModel[] => {
    return levels.filter( (level: LevelModel) => level.newStars > 0 );
}

export const updateWinLevel = (levels: LevelModel[], levelId: number, stars: number ) => {
    const userLevel: LevelModel = getLevelByID(levels, levelId);
    if (!userLevel.stars || stars > userLevel.stars) {
        userLevel.newStars = stars;
    }
    userLevel.isComplete = 1;
}

export const resetNewLevels = (levels:LevelModel[]) => {
    levels.forEach( level => {
        if ( level.newStars > 0 ) {
            level.stars = level.newStars;
            level.newStars = 0;
        }
    });
}