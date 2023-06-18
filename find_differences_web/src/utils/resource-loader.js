import * as PIXI from "pixi.js";
import {loadSounds} from "./sound-engine.js";
import * as urls from "../network/urls.js";

const progressBar = document.getElementById("progress-bar");
const progressBox = document.getElementById("progress-box");

const MAX_WIDTH_PROGRESS_BAR = progressBox.clientWidth;

const PX = "px";

const PROGRESS_STEP_SETTINGS = "settings";
const PROGRESS_STEP_GRAPHICS = "graphics";
const PROGRESS_STEP_SOUNDS_JSON = "sounds_json";
const PROGRESS_STEP_SOUNDS = "sounds";

const PROGRESS_STEPS = {
    [PROGRESS_STEP_SETTINGS]: 0.01,
    [PROGRESS_STEP_GRAPHICS]: 0.96,
    [PROGRESS_STEP_SOUNDS_JSON]: 0.01,
    [PROGRESS_STEP_SOUNDS]: 0.02
};

let progressStep = PROGRESS_STEPS[PROGRESS_STEP_SETTINGS];
let currentProgress = 0;

const updateProgressBar = ( progress, nextStepKey ) => {
    const width = MAX_WIDTH_PROGRESS_BAR * (currentProgress + progress);
    progressBar.style.width = width + PX;

    if ( nextStepKey ) {
        currentProgress += progress;
        progressStep = PROGRESS_STEPS[nextStepKey];
    }
};

let settingsData = null;
let resourceData = null;

export const loadResources = () => {

    return new Promise( async (resolve, reject) => {
        try {
            const response = await fetch( urls.URL_SETTINGS );

            settingsData = await response.json();

            updateProgressBar( progressStep, PROGRESS_STEP_GRAPHICS );

            resourceData = await PIXI.Assets.load(settingsData["loaderAssets"], ( loaded ) => {
                updateProgressBar( loaded * progressStep, loaded === 1 ? PROGRESS_STEP_SOUNDS_JSON : null );
            });

            const sndJsonResp = await fetch(settingsData["soundSpritePath"]);

            const soundJson = await sndJsonResp.json();

            updateProgressBar( progressStep, PROGRESS_STEP_SOUNDS );

            await loadSounds( soundJson );

            updateProgressBar( progressStep );

            setTimeout( resolve, 500 );

        } catch (err) {

            console.log("loadResources error");
            console.log(err);
            reject();

        }
    });

}

export const settings = () => settingsData;

export const resources = () => resourceData;