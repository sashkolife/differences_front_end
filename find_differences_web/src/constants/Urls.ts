export const URL_JSON_SETTINGS : string = "./res/settings.json";
export const URL_JSON_LOCALIZATION_EN : string = "./res/localizations/localization_en.json";
export const URL_JSON_SOUND_SPRITE : string = "./res/sounds/soundsprite.json";
export const URL_ASSETS_MANIFEST : any = [
    {
        "data": {
            "weights": ["normal","bold"]
        },
        "src": "./res/web/fonts/MyriadPro-Regular.woff"
    },
    {
        "name": "atlas_avatars",
        "src": "./res/pixi/atlases/atlas_avatars.json"
    },
    {
        "name": "atlas_collection",
        "src": "./res/pixi/atlases/atlas_collection.json"
    },
    {
        "name": "atlas_images",
        "src": "./res/pixi/atlases/atlas_images.json"
    },
    {
        "name": "atlas_mini",
        "src": "./res/pixi/atlases/atlas_mini.json"
    },
    {
        "name": "atlas_quests",
        "src": "./res/pixi/atlases/atlas_quests.json"
    },
    {
        "name": "atlas_trophy",
        "src": "./res/pixi/atlases/atlas_trophy.json"
    }
];
export const URL_MAPS: string = "./res/pixi/maps/";

export const URL_SERVER : string = "http://localhost:9002/";
// export const URL_SERVER : string = "http://localhost:9002/";
export const URL_LEVELS : string = URL_SERVER+"user/levels";
export const URL_SHOP : string = URL_SERVER+"user/shop";
export const URL_LOGIN : string = URL_SERVER+"user/login";

