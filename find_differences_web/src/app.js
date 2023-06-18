import {loadResources} from "./utils/resource-loader.js";
import {Game} from "./game/game.js";

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

loadResources().then( onResourcesLoadComplete ).catch( onResourcesLoadError );