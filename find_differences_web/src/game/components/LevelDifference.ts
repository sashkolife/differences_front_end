import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../components/CContainer";
import CSprite from "../../components/CSprite";

export default class LevelDifference extends CContainer {
    private _solve: CSprite;

    constructor( props: any ) {
        super( props );

        this._solve = this.getComponentByName("solve");

        //this.positionTest();
    }

    setSolve( value: boolean ) : void {
        this._solve.visible = value;
    }
}
