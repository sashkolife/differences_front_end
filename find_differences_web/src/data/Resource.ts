import * as PIXI from "pixi.js";
import * as urls from "../constants/urls";
import Properties from "./Properties";
import User from "./User";
import * as constants from "../constants/constants";
import {LevelPictureModel} from "../models/ApiModels";
import {URL_PICTURE_0_NAME} from "../constants/urls";

export default class Resource {

    public static async load( onProgress: Function ) {
        await PIXI.Assets.load( urls.URL_ASSETS_MANIFEST as PIXI.LoadAsset[], onProgress as PIXI.ProgressCallback );
    }

    public static async loadLocations(textureNames:Array<string>, onProgress?: Function ) {
        textureNames.forEach( (tName:string) => {
            PIXI.Assets.add(tName, urls.URL_MAPS+tName+urls.MAP_EXTENSION);
        } );
        await PIXI.Assets.load( textureNames, onProgress  as PIXI.ProgressCallback );
    }

    public static async loadCurrentLocation(onProgress?: Function) {
        const uLevel: number = User.level;

        const locationsToLoad: Array<string> = [];

        const locations:Array<any> = Properties.findAllByType(constants.COMPONENT_LOCATION);

        const getUserLocationByLevelId : Function = ( levelId:number ) => {
            for ( let i : number = 0; i < locations.length; i++ ) {
                const levels:Array<any> = Properties.findAllByType(constants.COMPONENT_MAP_LEVEL);
                for ( let j : number = 0; j < levels.length; j++ ) {
                    if ( levels[j].id == levelId ) {
                        return i;
                    }
                }
            }
        };

        const uLock: number = getUserLocationByLevelId( uLevel );

        const getLocationName: Function = (loc:any) => {
            const backgProps: any = Properties.findByName(constants.KEY_BACKGROUND, loc );
            return backgProps[constants.KEY_TEXTURE_FULL];
        };

        locationsToLoad.push(getLocationName(locations[uLock]));
        if ( uLock > 0 ) {
            locationsToLoad.push(getLocationName(locations[uLock-1]));
        }
        if ( uLock < locations.length-1 ) {
            locationsToLoad.push(getLocationName(locations[uLock+1]));
        }

        await this.loadLocations( locationsToLoad, onProgress );
    }

    public static getTexture( key: string ) : PIXI.Texture {
        return PIXI.Texture.from(key);
    }

    public static getSpineData( key: string ) : any {
        return null;
    }

    public static async loadPicture( picConf:LevelPictureModel, onProgress: Function ) {
        const loaderArr: Array<string> = [];
        picConf.pictKey1 = picConf.id + constants.PICT_1;
        picConf.pictKey2 = picConf.id + constants.PICT_2;
        picConf.pictKeyJson = picConf.id + constants.PICT_JSON;

        if ( !PIXI.Assets.cache.get(picConf.pictKey1) ) {

            PIXI.Assets.add(picConf.pictKey1, urls.URL_PICTURE_PATH + picConf.p + "/" + urls.URL_PICTURE_0_NAME);
            loaderArr.push(picConf.pictKey1);

            PIXI.Assets.add(picConf.pictKey2, urls.URL_PICTURE_PATH + picConf.p + "/" + urls.URL_PICTURE_1_NAME);
            loaderArr.push(picConf.pictKey2);

            PIXI.Assets.add(picConf.pictKeyJson, urls.URL_PICTURE_PATH + picConf.p + "/" + urls.URL_PICTURE_JSON);
            loaderArr.push(picConf.pictKeyJson);

            await PIXI.Assets.load(loaderArr, onProgress as PIXI.ProgressCallback);

        }
    }
}