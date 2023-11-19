import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSlice9 from "../../../components/CSlice9";
import CBMText from "../../../components/CBMText";
import * as constants from "../../../constants/constants";
import PicturesProgressBar from "./PicturesProgressBar";
import BalanceBar from "../common/BalanceBar";
import LevelProgressDifference from "./LevelProgressDifference";
import {ComponentModel, ContainerModel} from "../../../models/PropertiesModels";
import {ParticleAnimation} from "../../../animations/ParticleAnimation";

export default class DifferencesProgressBar extends CContainer {

    private _differencesText: CBMText;
    private _differencesCountText: CBMText;
    private _differences: Array<CContainer>;

    private _differencesCount: number = 0;

    constructor( props: ContainerModel ) {
        super( props );

        this._differencesText = this.getComponentByName("differencesText");

        this._differencesCountText = this.getComponentByName("differencesCountText");

        this._differences = this.getComponentsByType(constants.COMPONENT_LEVEL_PROGRESS_DIFFERENCE);

        for ( let i : number = 0; i < this._differences.length; i++ ) {
            const solveLight:CSprite = this._differences[i].getComponentByName("solveLight");
            solveLight.blendMode = PIXI.BLEND_MODES.ADD;
        }
    }

    getNewComponentByType( props: ComponentModel ): any {

        let comp:any = super.getNewComponentByType( props );

        if ( !comp ) {
            const type: string = props.type;
            if ( type == constants.COMPONENT_LEVEL_PROGRESS_DIFFERENCE ) {
                comp = new LevelProgressDifference(props);
            }
        }

        return comp;
    }

    setCount( num: number ) : void {
        this.reset();

        this._differencesCount = num;

        for ( let i : number = 0; i < this._differences.length; i++ ) {
            this._differences[i].visible = i < this._differencesCount;
        }

        this._differencesCountText.x = this._differences[Math.min(this._differencesCount-1,this._differences.length-1)].x + 30;
        this.x = (( (window as any).APP_WIDTH - this.width) >> 1) + this.properties.x;

        this.updateCounter();
    }

    setFound( idx: number, callback?: Function ) : void {
        const solve:CSprite = this._differences[idx].getComponentByName("solve");
        const solveLight:CSprite = this._differences[idx].getComponentByName("solveLight");
        const particleSolve:ParticleAnimation = this._differences[idx].getComponentByName("particleSolve");
        solveLight.visible = solve.visible = true;
        solveLight.alpha = 0;
        const count: number = this.updateCounter();
        const tl: gsap.core.Timeline = gsap.timeline({onComplete: () => {
                if ( count === this._differencesCount ) {
                    this.allSolvedAnimate( callback );
                } else {
                    if (callback) callback();
                }
            }
        });
        tl.to(solveLight, {duration: 0.2, alpha: 1});
        tl.to(solveLight, {duration: 0.5, alpha: 0, ease: "circ.inOut"});
        particleSolve.playOnce();
    }

    private allSolvedAnimate(callback: Function): void {
        const tl: gsap.core.Timeline = gsap.timeline({onComplete: () => {
                if (callback) callback();
            }
        });

        for ( let i : number = 0; i < this._differences.length; i++ ) {
            const particleSolve:ParticleAnimation = this._differences[i].getComponentByName("particleSolve");
            const solveLight:CSprite = this._differences[i].getComponentByName("solveLight");
            solveLight.visible = true;
            solveLight.alpha = 0;
            tl.to(solveLight, {duration: 0.2, pixi: {scaleX: 1.2, scaleY: 1.2}, alpha: 1, onStartParams: [particleSolve], onStart: (partSolve:ParticleAnimation) => partSolve.playOnce()}, "-=0.2");
            tl.to(solveLight, {duration: 0.15, pixi: {scaleX: 1, scaleY: 1}, alpha: 0});
        }
    }

    reset() : void {
        for ( let i : number = 0; i < this._differences.length; i++ ) {
            const solve:CSprite = this._differences[i].getComponentByName("solve");
            solve.visible = false;
        }
    }

    updateCounter() : number {
        let count:number = 0;
        this._differences.forEach( (comp:CContainer) => {
            const solve:CSprite = comp.getComponentByName("solve");
            if ( solve.visible === true ) {
                count++;
            }
        } );
        this._differencesCountText.text = count + "/" + this._differencesCount.toString();

        return count;
    }
}
