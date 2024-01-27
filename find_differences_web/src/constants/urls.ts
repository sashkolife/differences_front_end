export const URL_JSON_PROPERTIES = [
    {
        "name": "sceneLevel",
        "src": "./res/properties/sceneLevel.json"
    },
    {
        "name": "sceneLobby",
        "src": "./res/properties/sceneLobby.json"
    },
    {
        "name": "sceneTrophyRoom",
        "src": "./res/properties/sceneTrophyRoom.json"
    },
    {
        "name": "screenBlock",
        "src": "./res/properties/screenBlock.json"
    },
    {
        "name": "windows",
        "src": "./res/properties/windows.json"
    },
    {
        "name": "campaign1",
        "src": "./res/properties/campaign1.json"
    },
    {
        "name": "campaign2",
        "src": "./res/properties/campaign2.json"
    },
    {
        "name": "campaign3",
        "src": "./res/properties/campaign3.json"
    },
    {
        "name": "campaign4",
        "src": "./res/properties/campaign4.json"
    },
    {
        "name": "campaign5",
        "src": "./res/properties/campaign5.json"
    },
    {
        "name": "campaign6",
        "src": "./res/properties/campaign6.json"
    },
    {
        "name": "campaign7",
        "src": "./res/properties/campaign7.json"
    },
    {
        "name": "campaign8",
        "src": "./res/properties/campaign8.json"
    },
    {
        "name": "campaign9",
        "src": "./res/properties/campaign9.json"
    },
    {
        "name": "campaign10",
        "src": "./res/properties/campaign10.json"
    }
];
export const URL_JSON_LOCALIZATION_EN : string = "./res/localizations/localization_en.json";
export const URL_JSON_LOCALIZATION_UK : string = "./res/localizations/localization_uk.json";
export const URL_JSON_SOUND_SPRITE : string = "./res/sounds/soundsprite.json";
export const URL_ASSETS_MANIFEST = [
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
    // {
    //     "name": "atlas_collections",
    //     "src": "./res/pixi/atlases/atlas_collections.json"
    // },
    {
        "name": "atlas_images",
        "src": "./res/pixi/atlases/atlas_images.json"
    },
    {
        "name": "atlas_mini",
        "src": "./res/pixi/atlases/atlas_mini.json"
    },
    // {
    //     "name": "atlas_persononaj_gregor",
    //     "src": "./res/pixi/atlases/atlas_persononaj_gregor.json"
    // },
    {
        "name": "atlas_persononaj_holmes",
        "src": "./res/pixi/atlases/atlas_persononaj_holmes.json"
    },
    // {
    //     "name": "atlas_persononaj_jonathan",
    //     "src": "./res/pixi/atlases/atlas_persononaj_jonathan.json"
    // },
    // {
    //     "name": "atlas_persononaj_martin",
    //     "src": "./res/pixi/atlases/atlas_persononaj_martin.json"
    // },
    // {
    //     "name": "atlas_persononaj_molly",
    //     "src": "./res/pixi/atlases/atlas_persononaj_molly.json"
    // },
    // {
    //     "name": "atlas_persononaj_moriarty",
    //     "src": "./res/pixi/atlases/atlas_persononaj_moriarty.json"
    // },
    // {
    //     "name": "atlas_persononaj_sebastian",
    //     "src": "./res/pixi/atlases/atlas_persononaj_sebastian.json"
    // },
    // {
    //     "name": "atlas_persononaj_tobias",
    //     "src": "./res/pixi/atlases/atlas_persononaj_tobias.json"
    // },
    // {
    //     "name": "atlas_quests",
    //     "src": "./res/pixi/atlases/atlas_quests.json"
    // },
    {
        "name": "atlas_trophy",
        "src": "./res/pixi/atlases/atlas_trophy.json"
    },
    {
        "name": "atlas_windows",
        "src": "./res/pixi/atlases/atlas_windows.json"
    },
    {
        "name": "trophy_room",
        "src": "./res/pixi/maps/trophy_room.jpg"
    },
    {
        "name": "Astachov_brown",
        "src": "./res/pixi/bmFonts/Astachov_brown.fnt"
    },
    {
        "name": "Astachov_green",
        "src": "./res/pixi/bmFonts/Astachov_green.fnt"
    },
    {
        "name": "Astachov_blue_shadow",
        "src": "./res/pixi/bmFonts/Astachov_blue_shadow.fnt"
    },
    {
        "name": "Russia_brown",
        "src": "./res/pixi/bmFonts/Russia_brown.fnt"
    },
    {
        "name": "Russia_white_shadow",
        "src": "./res/pixi/bmFonts/Russia_white_shadow.fnt"
    },
    {
        "name": "Russia_limon_shadow",
        "src": "./res/pixi/bmFonts/Russia_limon_shadow.fnt"
    },
    {
        "name": "Russia_cups_nums",
        "src": "./res/pixi/bmFonts/Russia_cups_nums.fnt"
    },
    {
        "name": "Russia_blue",
        "src": "./res/pixi/bmFonts/Russia_blue.fnt"
    },
    {
        "name": "win_lobby_star",
        "src": "./res/pixi/particles/win_lobby_star.json"
    },
    {
        "name": "particle_wheel_blue",
        "src": "./res/pixi/particles/particle_wheel_blue.json"
    },
    {
        "name": "particle_blue",
        "src": "./res/pixi/particles/particle_blue.json"
    },
    {
        "name": "particle_green_win",
        "src": "./res/pixi/particles/particle_green_win.json"
    }
];
export const URL_MAPS: string = "./res/pixi/maps/";

export const URL_SERVER : string = "http://localhost:9002/";
//export const URL_SERVER : string = "http://vps27605ua.hyperhost.name:9002/"; //remote
export const URL_LEVELS : string = URL_SERVER+"user/levels";
export const URL_SHOP : string = URL_SERVER+"user/shop";
export const URL_LOGIN : string = URL_SERVER+"user/login/?id=";
export const URL_OPEN_LOCATION : string = URL_SERVER+"user/openLocation";
export const URL_SELL_TROPHY : string = URL_SERVER+"user/sellTrophy/?id=";

export const URL_LEVEL_START : string = URL_SERVER+"level/start/?levelId=";
export const URL_LEVEL_LEAVE : string = URL_SERVER+"level/leave";
export const URL_LEVEL_FIND : string = URL_SERVER+"level/find/?";
export const URL_LEVEL_PENALTY_SKIP : string = URL_SERVER+"level/penaltySkip";
export const URL_LEVEL_HELP : string = URL_SERVER+"level/help";
export const URL_LEVEL_ADD_EXTRA_TIME : string = URL_SERVER+"level/addExtraTime";

export const MAP_EXTENSION: string = ".jpg";

export const URL_PICTURE_PATH : string = URL_SERVER+"data/";
export const URL_PICTURE_0_NAME : string = "i0.jpg";
export const URL_PICTURE_1_NAME : string = "i1.jpg";
export const URL_PICTURE_JSON : string = "j.json";


