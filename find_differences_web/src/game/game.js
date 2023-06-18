import * as PIXI from 'pixi.js';
import GameButton from "../components/game-button.js";

export class Game extends PIXI.Application {

    constructor( options ) {
        super( options );
    }

    init() {
        const b = new GameButton();

        this.stage.addChild(b);
        b.x = 200;
        b.y = 200;
    }

}
