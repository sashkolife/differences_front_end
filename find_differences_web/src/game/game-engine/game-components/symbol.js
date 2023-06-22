import * as constants from "../../../constants/constants.js";
import SpineAnimation from "../../../components/spine-animation.js";
import * as check from "../../../utils/Check.ts";
import * as sender from "../../../utils/Sender.js";
import * as sounds from "../../../data/Sounds.ts";
import {Spine} from "pixi-spine";
import * as events from "../../../constants/events.js";
import * as input from "../../../constants/input.js";
import LabelTextBase from "../../../components/label-text-base.js";
import * as gameTexts from "../../../data/Localization.ts";
import {app} from "../../../App.ts";
import {gsap} from "gsap";

export class Symbol extends SpineAnimation {
    constructor( symbolId, stage, descriptor, bonusData ) {

        super(stage, descriptor);

        this.id = symbolId;
        this.bonusData = bonusData;

        if ( check.isAvailable(bonusData) ) {
            this.label = new LabelTextBase(this.animation, this.descriptor[constants.KEY_TEXT]);
            let labelText = bonusData["betPrize"];
            if ( check.isAvailable(bonusData[constants.KEY_TEXT_REFERENCE]) ) {
                labelText = gameTexts.getGameText(bonusData[constants.KEY_TEXT_REFERENCE]);
            } else {
                labelText = gameTexts.getCurrencyFormat( labelText );
            }
            this.label.setText( labelText );
        }
    }

    onOrientationChange(isPort) {}

    setSymbolWinAnimation(callback = null ) {
        this.stopAnimationSound();

        this.setCallback( callback );

        this.setAnimationById( constants.KEY_WIN_FRAME );

        if ( check.isAvailable(this.label) ) {
            this.label.fadeOut(0.3);
        }
    }

    toTop() {
        let topStg = app.stage;
        if ( check.isAvailable(this.animation) && this.animation.parent !== topStg ) {
            this.animation.position = topStg.toLocal( this.stage.toGlobal(this.animation.position) );
            this.animation.setParent( topStg );
        }
    }

    toPlace() {
        let topStg = app.stage;
        if ( check.isAvailable(this.animation) && this.animation.parent !== this.stage  ) {
            this.animation.position = this.stage.toLocal( topStg.toGlobal(this.animation.position) );
            this.stage.setParent( this.stage );
        }
    }

    playAnimationSound( frame ) {
        const soundsDesc = this.descriptor[constants.KEY_SOUNDS];
        if ( check.isAvailable(soundsDesc) && check.isAvailable(soundsDesc[frame]) ) {
            const soundRef = soundsDesc[frame][constants.KEY_SOUND_REF];
            const loop = Boolean(soundsDesc[frame][constants.KEY_LOOP]);
            if ( !sounds.isPlaying(soundRef) ) {
                sounds.playSound( soundRef, loop );
                this.currentSoundName = soundRef;
            }
        }
    }

    stopAnimationSound() {
        if ( check.isAvailable(this.currentSoundName) ) {
            sounds.stopSound( this.currentSoundName );
            this.currentSoundName = null;
        }
    }

    moveToPlace() {
        gsap.to(this.animation, {duration:1, y:this.landY});
    }

    onAnimationComplete() {
        super.onAnimationComplete();
        this.callback = null;
        this.setVisible(false);
    }

    destroy() {
        gsap.killTweensOf( this.animation );
        super.destroy();
    }

}
