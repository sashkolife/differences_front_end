import ContainerBase from "../../../components/container-base.js";
import * as sender from "../../../utils/Sender.js";
import * as events from "../../../constants/events.js";
import {getCurrencyFormat} from "../../../data/Localization.ts";
import * as check from "../../../utils/Check.ts";
import {isPort} from "../../../utils/orientation.js";
import * as constants from "../../../constants/constants.js";
import {ParticleAnimation} from "../../../components/particle-animation.js";
import {gsap} from "gsap";
import * as PIXI from "pixi.js";
import * as sounds from "../../../data/Sounds.ts";

export class TableWinBlocks extends ContainerBase {
    constructor( stage, descriptor, blocksWins ) {
        super(stage, descriptor);

        this.blocksWins = blocksWins;

        this.particlesWin = descriptor["particlesWin"];

        this.soundWin = descriptor[constants.KEY_SOUNDS][constants.SOUND_WIN];
        this.symbolCollect = descriptor[constants.KEY_SOUNDS][constants.SOUND_SYMBOL_COLLECT];

        this.winParticleContainer = null;

        for ( let i = 0; i < this.blocksWins.length; i ++ ) {
            this["tfPrize"+i] = null;
        }

        this.winTimelines = {};

        this.currentCounters = {};

        sender.subscribe(events.EVENT_ON_BET_CHANGE, this.onBetChanged.bind(this));

        this.init();

    }

    onInitComplete() {
        super.onInitComplete();

        this.winParticleContainer = new PIXI.Container();
        this.container.addChildAt(this.winParticleContainer, 0);
    }

    onBetChanged(betData) {
        for ( let i = 0; i < this.blocksWins.length; i++ ) {
            if ( check.isAvailable(this["tfPrize"+i]) ) {
                this["tfPrize" + i].setText(getCurrencyFormat(this.blocksWins[i] * betData.value))
            }
        }
    }

    playSymbolWinAnimation(blockId, full = true ) {
        if ( !check.isAvailable(this.currentCounters[blockId]) ) {
            this.currentCounters[blockId] = 0;
        }
        this.currentCounters[blockId]++;

        const winAnim = this.getComponentByName("win_"+blockId+"_"+this.currentCounters[blockId]);
        if ( check.isAvailable(winAnim) ) {
            winAnim.recreateAnimation();
            winAnim.setAnimationById( isPort() ? constants.KEY_PORTRAIT : constants.KEY_LANDSCAPE, false, full ? 0 : 1 );
            if ( full ) {
                setTimeout( ()=>{
                    sounds.playSoundObject( this.symbolCollect );
                }, 1000 );
            } else {
                sounds.playSoundObject( this.symbolCollect );
            }
        }
    }

    playBlockWinAnimation(colorId) {
        const descriptor = this.particlesWin[colorId];
        const particle = new ParticleAnimation( this.winParticleContainer, descriptor );

        const highlighters = this.getComponentsByName( "light_"+colorId );

        this.winTimelines[colorId] = gsap.timeline({repeat:-1});
        for ( let i = 0; i < highlighters.length; i++ ) {
            this.winTimelines[colorId].to( highlighters[i].sprite, { duration: 0.2, alpha: 0.7,
                onStart: (s) => {
                    s.parent.addChild(s);
                    const pX = s.x;
                    const pY = s.y;
                    particle.setPortXY(pX, pY);
                    particle.setLandXY(pX, pY);
                    particle.onOrientationChange();
                    particle.playOnce();
                }, onStartParams: [highlighters[i].sprite],
                onComplete: (s) => {
                    gsap.to( s, { duration: 1, alpha: 0 } );
                },
                onCompleteParams: [highlighters[i].sprite]
            }, "-=0.05" );
        }

        sounds.playSoundObject( this.soundWin );
    }

    reset() {
        this.stopBlockWinAnimations();
        this.hideWinSymbols();
    }

    stopBlockWinAnimations() {
        for ( let colorId in this.winTimelines ) {
            this.winTimelines[colorId].repeat(0);
            const highlighters = this.getComponentsByName( "light_"+colorId );
            highlighters.forEach(v=>v.setAlpha(0));
        }
        this.winTimelines = {};

        sounds.fadeAndStopSound( this.soundWin[constants.KEY_SOUND_REF], 1);
    }

    hideWinSymbols() {
        for ( let id in this.currentCounters ) {
            const winComponents = this.getComponentsByName("win_" + id );
            winComponents.forEach( component => {
                component.setVisible(false);
            } );
        }
        this.currentCounters = {};
    }

    onOrientationChange() {
        super.onOrientationChange();

        for ( let id in this.currentCounters ) {
            for ( let i = 1; i <= this.currentCounters[id]; i++ ) {
                const winAnim = this.getComponentByName("win_" + id + "_" + i);
                if (check.isAvailable(winAnim)) {
                    winAnim.recreateAnimation();
                    winAnim.setAnimationById(isPort() ? constants.KEY_PORTRAIT : constants.KEY_LANDSCAPE, false, 1.5);
                }
            }
        }
        //
        // this.stopBlockWinAnimations();
    }
}