import {Game} from "./game/Game";
import {load} from "./Preloader";

export const APP_WIDTH = 1280;
export const APP_HEIGHT = 720;

export const mainContainer = document.getElementById("main-container");
export const gameContainer = document.getElementById("game-container");

let preloaderContainer = document.getElementById("preloader-container");

const blockBackground = document.getElementById("block-background");
const messageError = document.getElementById("message-error");

export const game = new Game( {
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: 0xfff5e7
} );

const onResourcesLoadComplete = () => {
    removePreloader();

    gameContainer.appendChild( game.view );
    game.init();
}

const onResourcesLoadError = () => {
    showMessageError();
}

function showMessageError() {
    removePreloader();
    blockBackground.style.display = "flex";
    messageError.style.display = "flex";
}

function removePreloader() {
    if ( preloaderContainer ) {
        preloaderContainer.remove();
        preloaderContainer = null;
    }
}

function onResize() {
    var ratio = Math.min(window.innerWidth / APP_WIDTH, window.innerHeight / APP_HEIGHT );
    mainContainer.style.transform = "scale(" + ratio + ")";

}

window.onresize = onResize;

onResize();

load().then( onResourcesLoadComplete ).catch( onResourcesLoadError );