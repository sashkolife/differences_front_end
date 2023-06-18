import * as PIXI from 'pixi.js';
import ContainerBase from "../../../components/container-base.js";
import * as sender from "../../../events/event-bus.js";
import * as events from "../../../constants/events.js";
import {getCurrencyFormat} from "../../../utils/game-texts.js";
import * as check from "../../../utils/check.js";
import {isPort} from "../../../utils/orientation.js";
import * as constants from "../../../constants/constants.js";
import * as input from "../../../constants/input.js";
import * as sounds from "../../../utils/sound-engine.js";

export class RollWheel extends ContainerBase {
    constructor( stage, descriptor, blocksWins ) {
        super(stage, descriptor);

        this.soundStart = descriptor[constants.KEY_SOUNDS][constants.SOUND_START];
        this.soundWinExtra = descriptor[constants.KEY_SOUNDS][constants.SOUND_WIN];

        this.particlesContainer = null;
        this.activeAnimation = null;
        this.btnRoll = null;
        this.tfRollsDynamic = null;
        this.tfRollsStatic = null;
        this.tfExtraRolls = null;

        this.STATE_HIDDEN = 0;
        this.STATE_DISABLED = 1;
        this.STATE_ENABLED_ROLL = 2;
        this.STATE_ENABLED_EXTRA = 3;

        this.state = this.STATE_HIDDEN;

        this.currentWheelParticle = null;

        this.init();

    }

    onInitComplete() {
        super.onInitComplete();

        //this.btnRoll.setCallback( this.onWheelAnimateComplete.bind(this) );

        this.btnRoll.animation.on( input.MOUSE_UP, this.onWheelClick.bind(this) );
        this.btnRoll.animation.on( input.TOUCH_END, this.onWheelClick.bind(this) );

        this.setRollState( this.STATE_DISABLED );
    }

    setRollState( stValue ) {
        if ( stValue !== this.state ) {
            this.state = stValue;
            switch ( this.state ) {
                case this.STATE_HIDDEN:
                    this.btnRoll.setVisible(false);
                    this.tfExtraRolls.setVisible(false);
                    this.setRollsVisible( false );
                    this.pauseActive();
                    break;
                case this.STATE_DISABLED:
                    this.setRollWheelEnabled( false );
                    this.pauseActive();
                    break;
                case this.STATE_ENABLED_ROLL:
                    this.btnRoll.setVisible(true);
                    this.tfExtraRolls.setVisible(false);
                    this.setRollsVisible( true );
                    this.setRollWheelEnabled( true );
                    this.playActive();
                    break;
                case this.STATE_ENABLED_EXTRA:
                    this.btnRoll.setVisible(true);
                    this.tfExtraRolls.setVisible(true);
                    this.setRollsVisible( false );
                    this.setRollWheelEnabled( true );
                    this.playExtraParticle();
                    this.playActive();
                    break;
            }
        }
    }

    onWheelClick() {
        this.setRollState( this.STATE_DISABLED );
        sender.publish( events.EVENT_UI_ON_ROLL_PRESSED );
    }

    onWheelAnimateComplete() {
        sender.publish( events.EVENT_ON_ROLL_ANIMATE_COMPLETE );
    }

    setRollWheelEnabled( value ) {
        this.btnRoll.animation.interactive = value;
        this.btnRoll.animation.buttonMode = value;
    }

    startRollWheel( colorId ) {
        this.btnRoll.setAnimationById( colorId );
        sounds.playSoundObject( this.soundStart );
    }

    setRounds( value ) {
        this.tfRollsDynamic.setText( value );
    }

    setRollsVisible( value ) {
        this.tfRollsStatic.setVisible( value );
        this.tfRollsDynamic.setVisible( value );
    }

    playActive() {
        this.activeAnimation.recreateAnimation();
        this.activeAnimation.onOrientationChange();
        this.activeAnimation.fadeIn();
        this.activeAnimation.setAnimationById( constants.KEY_ANIMATION );
    }

    pauseActive() {
        this.activeAnimation.fadeOut(1,()=>{
            this.activeAnimation.stopAnimation();
        });
    }

    playWheelParticle( colorId ) {
        this.currentWheelParticle = this.particlesContainer.getComponentByName("particle"+ colorId);
        this.currentWheelParticle.playOnce();
    }

    stopWheelParticle() {
        if ( check.isAvailable(this.currentWheelParticle) ) {
            this.currentWheelParticle.playOnce();
        }
    }

    playExtraParticle() {
        const wheelParticle = this.particlesContainer.getComponentByName("extraParticle");
        wheelParticle.playOnce();
        sounds.playSoundObject( this.soundWinExtra );
    }
}