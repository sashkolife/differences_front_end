import * as PIXI from 'pixi.js';
import {Game} from "./game/Game";
import {load} from "./Preloader";

import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CustomEase } from 'gsap/CustomEase';
import EventBus from "./utils/EventBus";
import * as events from "./constants/events";
import {EVENT_ON_NETWORK_ERROR} from "./constants/events";

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(CustomEase);
PixiPlugin.registerPIXI(PIXI);

export const debug: boolean = false;
export const screenOrientation : "landscape"|"portrait" = "landscape";

export const gameContainer: HTMLElement = document.getElementById("game-container");

let preloaderContainer: HTMLElement = document.getElementById("preloader-container");

const blockBackground: HTMLElement = document.getElementById("block-background");
const messageError: HTMLElement = document.getElementById("message-error");

export const game: Game = new Game( {
    width: (window as any).APP_WIDTH,
    height: (window as any).APP_HEIGHT,
    backgroundColor: 0xfff5e7
} );

// gameContainer.appendChild( game.view );

const onResourcesLoadComplete = () => {
    gameContainer.appendChild( game.view );
    game.init();
    setTimeout(removePreloader, 500);
}

const onResourcesLoadError = (err:Error) => {
    console.error(err);
    showMessageError();
}

function showMessageError(): void {
    removePreloader();
    blockBackground.style.display = "flex";
    messageError.style.display = "flex";
}

function removePreloader(): void {
    if ( preloaderContainer ) {
        preloaderContainer.remove();
        preloaderContainer = null;
    }
    gameContainer.style.display = "flex";
}

load().then( onResourcesLoadComplete ).catch( onResourcesLoadError );

EventBus.subscribe(events.EVENT_ON_NETWORK_ERROR, showMessageError);