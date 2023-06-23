import * as PIXI from "pixi.js";
import * as urls from "../constants/urls";

export default class Resource {

    public static async load( onProgress: Function ) {
        await PIXI.Assets.load( urls.URL_ASSETS_MANIFEST as PIXI.LoadAsset[], onProgress as PIXI.ProgressCallback );
    }

    public static async loadCurrentMap( onProgress: Function ) {
        await PIXI.Assets.load( urls.URL_MAPS+"islands_map.jpg", onProgress  as PIXI.ProgressCallback );
    }

    public static getTexture( key: string ) : PIXI.Texture {
        const asset : any = PIXI.Assets.get(key);
        return PIXI.Texture.from(key);
    }

    public static getSpineData( key: string ) : any {
        return null;
    }

    public static getParticleData( key: string ) : any {
        return null;
    }
}