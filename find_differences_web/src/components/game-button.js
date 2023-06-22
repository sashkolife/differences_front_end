import { gsap } from "gsap";
import * as input from '../constants/input.js'
import * as check from '../utils/Check.ts'
import * as sounds from "../data/Sounds.ts";
import * as constants from "../constants/constants.js";
import * as PIXI from "pixi.js";

class GameButton extends PIXI.Sprite {

    /*
        @options {
                soundRef: "on_click_sound",
                action: ( btn ) => {},
                textureNormal: "btn_green_long_normal",
                textureOver: "btn_green_long_over",
                textureDown: "btn_green_long_down",
                textureDisable: "btn_green_long_disabled",
                scaleX: 0.5,
                scaleY: 0.5,
                scaleOver: 1.05,
                scaleDown: 0.95
            }
     */
    constructor( options ) {

        super();

        this.options = options;

        this.scaleX = 1;
        this.scaleY = 1;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.scaleOver = null;
        this.scaleDown = null;
        this.action = null;
        this.soundRef = null;
        this.textureNameNormal = null;
        this.textureNameOver = null;
        this.textureNameDown = null;
        this.textureNameDisable = null;
        this.textureNormal = null;
        this.textureOver = null;
        this.textureDown = null;
        this.textureDisable = null;

        this.setOptions( options );

        this.BUTTON_STATE_NORMAL = 1;
        this.BUTTON_STATE_MOUSE_OVER = 2;
        this.BUTTON_STATE_DOWN = 3;
        this.BUTTON_STATE_DISABLED = 4;

        this.state = this.BUTTON_STATE_NORMAL;

        this.isMouseOver = false;
        this.isTouchEnd = false;

        this.on( input.MOUSE_DOWN, this.onTouchStart.bind(this) );
        this.on( input.MOUSE_UP, this.onTouchEnd.bind(this) );
        this.on( input.MOUSE_OVER, this.onMouseOver.bind(this) );
        this.on( input.MOUSE_OUT, this.onMouseOut.bind(this) );
        this.on( input.MOUSE_OUT_OUTSIDE, this.onMouseOut.bind(this) );
        this.on( input.TOUCH_START, this.onTouchStart.bind(this) );
        this.on( input.TOUCH_END, this.onTouchEnd.bind(this) );
        this.on( input.TOUCH_END_OUTSIDE, this.onMouseOut.bind(this) );

        this.setEnabled( true );
    }

    setOptions( options ) {
        if ( options ) {
            this.options = options;

            this.scaleX = options[constants.KEY_SCALE_X] || this.scaleX;
            this.scaleY = options[constants.KEY_SCALE_Y] || this.scaleY;
            this.anchorX = options[constants.KEY_ANCHOR_Y] || this.anchorX;
            this.anchorY = options[constants.KEY_ANCHOR_Y] || this.anchorY;
            this.scaleOver = options[constants.KEY_OVER_SCALE];
            this.scaleDown = options[constants.KEY_DOWN_SCALE];
            this.soundRef = options[constants.KEY_SOUND_REF];
            this.action = options[constants.KEY_ACTION];

            this.textureNameNormal = options[constants.KEY_TEXTURE_NORMAL];
            this.textureNameOver = options[constants.KEY_TEXTURE_OVER];
            this.textureNameDown = options[constants.KEY_TEXTURE_DOWN];
            this.textureNameDisable = options[constants.KEY_TEXTURE_DISABLE];

            this.textureNormal = this.textureNameNormal ? PIXI.Texture.from(this.textureNameNormal) : null;
            this.textureOver = this.textureNameOver ? PIXI.Texture.from(this.textureNameOver) : null;
            this.textureDown = this.textureNameDown ? PIXI.Texture.from(this.textureNameDown) : null;
            this.textureDisable = this.textureNameDisable ? PIXI.Texture.from(this.textureNameDisable) : null;
        }

        this.updateView();
    }

    updateView() {
        this.anchor.set( this.anchorX, this.anchorY );
        this.scale.set( this.scaleX, this.scaleY );
        this.texture = this.textureNormal;
    }

    setEnabled( enable ) {
        if ( enable ) {
            this.state = this.BUTTON_STATE_NORMAL;
            this.interactive = true;
            this.cursor = "pointer";
        } else {
            this.state = this.BUTTON_STATE_DISABLED;
            this.interactive = false;
            this.cursor = "none";
        }
    }

    onTouchStart() {
        this.state = this.BUTTON_STATE_DOWN;

        this.texture = this.textureDown;

        if ( check.isAvailable(this.scaleDown) ) {
            gsap.killTweensOf( this.scale );
            gsap.to(this.scale, {
                duration: 0.05,
                x: this.scaleX * this.scaleDown,
                y: this.scaleY * this.scaleDown,
                ease: "none",
                onComplete: () => {
                    if ( this.state !== this.BUTTON_STATE_DOWN ) {
                        this.animateToNormal();
                    }
                }
            });
        }
    }

    onTouchEnd() {
        this.state = this.BUTTON_STATE_NORMAL;
        this.isTouchEnd = true;

        this.texture = this.textureNormal;

        if ( check.isFunction(this.action) ) {
            this.action(this);
        }
        this.playSound();
        this.animateToNormal();
    }

    animateToNormal() {
        gsap.to(this.scale, {
            duration: 0.1,
            ease: "none",
            x: this.scaleX,
            y: this.scaleY,
            onComplete: ()=>{
                if ( this.isMouseOver ) {
                    this.onMouseOver();
                }
            }
        } );
    }

    playSound() {
        if ( check.isAvailable(this.soundRef) ) {
            sounds.playSound(this.soundRef );
        }
    }

    onMouseOver() {
        if ( this.state === this.BUTTON_STATE_DISABLED ) return;
        if ( this.isTouchEnd === true ) return;

        this.texture = this.textureOver;

        this.isMouseOver = true;

        if ( check.isAvailable(this.scaleOver) ) {
            gsap.killTweensOf( this.scale );
            gsap.to( this.scale, {
                duration: 0.2,
                ease: "none",
                x: this.scaleX * this.scaleOver,
                y: this.scaleY * this.scaleOver
            } );
        }
        this.state = this.BUTTON_STATE_MOUSE_OVER;
    }

    onMouseOut() {
        if ( this.state === this.BUTTON_STATE_DISABLED ) return;

        this.texture = this.textureNormal;

        this.isTouchEnd = false;

        this.isMouseOver = false;

        this.animateToNormal();
    }

    setAction(callback) {
        this.action = callback;
    }

}

export default GameButton;
