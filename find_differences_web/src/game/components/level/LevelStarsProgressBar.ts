import * as PIXI from 'pixi.js';
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CBMText from "../../../components/CBMText";
import {ComponentModel, ContainerModel} from "../../../models/PropertiesModels";
import ThreeStateStar from "../common/ThreeStateStar";
import * as Constants from "constants";
import {COMPONENT_THREE_STATE_STAR} from "../../../constants/constants";
import Localization from "../../../data/Localization";

export default class LevelStarsProgressBar extends CContainer {

    private _progressLine: CSprite;
    private _levelTimerText : CBMText;
    private _stars: ThreeStateStar[];

    private _starsTimer:number = 0;
    private _starsTimerInterval:any = 0;

    private _timersValues:number[] = null;

    constructor( props: ContainerModel ) {
        super( props );

        const mContainer: CContainer = this.getComponentByName("maskContainer");
        this._progressLine = mContainer.getComponentByName("progressLine");

        this._stars = this.getComponentsByType(COMPONENT_THREE_STATE_STAR);

        this._levelTimerText = this.getComponentByName("levelTimerText");
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        super.destroy(_options);

        window.clearInterval( this._starsTimerInterval );
    }

    getNewComponentByType(props: ComponentModel): any {
        if ( props.type === COMPONENT_THREE_STATE_STAR ) {
            return new ThreeStateStar(props);
        }
        return super.getNewComponentByType(props);
    }

    setTimers( timers: number[], starsTime: number ) : void {
        this._timersValues = timers;
        if ( starsTime > 0 ) {
            this._starsTimer = starsTime;
            this._starsTimerInterval = window.setInterval(this.onStarsTimerTick.bind(this), 1000);
            this.onStarsTimerTick();
        } else {
            this._starsTimer = 0;
            this._levelTimerText.text = Localization.convertToHHMMSS(0);
        }

        this.updateStars(false);
        this.updateProgress();
    }

    public addStarsTimer( value: number ) : void {
        this._starsTimer += value;
        if ( !this._starsTimerInterval ) {
            this._starsTimerInterval = window.setInterval(this.onStarsTimerTick.bind(this), 1000);
            this.onStarsTimerTick();
        }
    }

    private updateStars( animate: boolean ): void {
        const spentTime: number = this._timersValues[0]-this._starsTimer;
        for ( let i: number = 0; i < this._timersValues.length; i++ ) {
            if ( spentTime > this._timersValues[i] ) {
                this._stars[i].setEmpty();
            } else {
                this._stars[i].setFull();
            }
        }
    }

    private updateProgress(): void {
        const time: number = this._starsTimer < 0 ? 0 : this._starsTimer > this._timersValues[0] ? this._timersValues[0] : this._starsTimer;
        console.log(this._progressLine.width);
        this._progressLine.x = this._progressLine.width - this._progressLine.width*((this._timersValues[0]-time)/this._timersValues[0]);
    }

    private onStarsTimerTick() : void {
        this._starsTimer--;

        if ( this._starsTimer <= 0 ) {
            this._starsTimer = 0;
            window.clearInterval( this._starsTimerInterval );
            this._starsTimerInterval = null;
        }

        this._levelTimerText.text = Localization.convertToHHMMSS(this._starsTimer);
        this.updateStars(true);
        this.updateProgress();
    }
}
