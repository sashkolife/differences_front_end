import Sounds from "./data/Sounds";
import Properties from "./data/Properties";
import Localization from "./data/Localization";
import User from "./data/User";
import Resource from "./data/Resource";
import Levels from "./data/Levels";
import Shop from "./data/Shop";

export const load = () => {

    const progressBar : HTMLElement = document.getElementById("progress-bar");
    const progressBox : HTMLElement = document.getElementById("progress-box");

    const MAX_WIDTH_PROGRESS_BAR : number = progressBox.clientWidth;

    const PX : string = "px";

    const PROGRESS_STEP_USER_DATA : string = "user_data";
    const PROGRESS_STEP_LEVELS : string = "levels";
    const PROGRESS_STEP_SHOP : string = "shop";
    const PROGRESS_STEP_PROPERTIES : string = "settings";
    const PROGRESS_STEP_LOCALIZATION : string = "localization";
    const PROGRESS_STEP_GRAPHICS : string = "graphics";
    const PROGRESS_STEP_MAP : string = "map";
    const PROGRESS_STEP_SOUNDS_JSON : string = "sounds_json";
    const PROGRESS_STEP_SOUNDS : string = "sounds";

    /**
     * Summa of all must 1
     */
    const PROGRESS_STEPS : any = {
        [PROGRESS_STEP_USER_DATA]: 0.02,
        [PROGRESS_STEP_LEVELS]: 0.01,
        [PROGRESS_STEP_SHOP]: 0.01,
        [PROGRESS_STEP_PROPERTIES]: 0.01,
        [PROGRESS_STEP_LOCALIZATION]: 0.01,
        [PROGRESS_STEP_GRAPHICS]: 0.85,
        [PROGRESS_STEP_MAP]: 0.06,
        [PROGRESS_STEP_SOUNDS_JSON]: 0.01,
        [PROGRESS_STEP_SOUNDS]: 0.02
    };

    let progressStep = PROGRESS_STEPS[PROGRESS_STEP_USER_DATA];
    let currentProgress = 0;

    const updateProgressBar = ( progress:number, nextStepKey?:string ) => {
        const width = MAX_WIDTH_PROGRESS_BAR * (currentProgress + progress);
        progressBar.style.width = width + PX;

        if ( nextStepKey ) {
            currentProgress += progress;
            progressStep = PROGRESS_STEPS[nextStepKey];
        }
    };

    return new Promise( async ( resolve : Function, reject : Function ) => {
        try {

            await User.load();

            updateProgressBar( progressStep, PROGRESS_STEP_LEVELS );

            await Levels.load();

            updateProgressBar( progressStep, PROGRESS_STEP_SHOP );

            await Shop.load();

            updateProgressBar( progressStep, PROGRESS_STEP_PROPERTIES );

            await Properties.load();

            updateProgressBar( progressStep, PROGRESS_STEP_LOCALIZATION );

            await Localization.load();

            updateProgressBar( progressStep, PROGRESS_STEP_GRAPHICS );

            await Resource.load( ( loaded : number ) => {
                updateProgressBar( loaded * progressStep, loaded === 1 ? PROGRESS_STEP_MAP : null );
            } );

            await Resource.loadCurrentLocation( (loaded : number ) => {
                updateProgressBar( loaded * progressStep, loaded === 1 ? PROGRESS_STEP_SOUNDS_JSON : null );
            } );

            await Sounds.loadSoundsJson();

            updateProgressBar( progressStep, PROGRESS_STEP_SOUNDS );

            await Sounds.loadSounds();

            updateProgressBar( progressStep );

            resolve();

        } catch (err) {

            console.log("loadResources error");
            console.log(err);
            reject();

        }
    });

}