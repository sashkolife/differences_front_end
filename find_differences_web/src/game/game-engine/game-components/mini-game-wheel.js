import { gsap } from 'gsap';
import ContainerBase from "../../../components/container-base.js";
import * as sender from "../../../events/event-bus.js";
import * as events from "../../../constants/events.js";
import * as check from "../../../utils/check.js";
import LabelTextBase from "../../../components/label-text-base.js";
import * as constants from "../../../constants/constants.js";
import * as gameTexts from "../../../utils/game-texts.js";
import * as sounds from "../../../utils/sound-engine.js";

export class MiniGameWheel extends ContainerBase {
    constructor(stage, descriptor, mgColorsConfig) {
        super(stage, descriptor);

        this.soundStart = descriptor[constants.KEY_SOUNDS][constants.SOUND_START];
        this.soundWin = descriptor[constants.KEY_SOUNDS][constants.SOUND_WIN];

        this.minigameColorsConfig = mgColorsConfig;
        this.sectors = null;
        this.btnSpin = null;

        this.winAnimation = null;

        this.sectorsItems = null;

        this.wheelData = null;

        this.init();
    }

    onInitComplete() {
        super.onInitComplete();

        this.sectorsItems = this.sectors.getComponentsByName("sector");


        this.btnSpin.setAction( this.onBtnSpinClick.bind(this) );
    }

    prepare( wData ) {
        this.wheelData = wData;
        for ( let i = 0; i < this.sectorsItems.length; i++ ) {
            if ( check.isAvailable(this.wheelData[i]) ) {
                const wData = this.wheelData[i];
                const sector = this.sectorsItems[i];
                const sectorLabel = sector.getComponentByName("tfWin");
                const sectorImage = sector.getComponentByName("imgWin");

                sectorLabel.setVisible(false);
                sectorImage.setVisible(false);

                if ( wData[constants.KEY_NAME].startsWith( "instantWin" ) ) {
                    sectorLabel.setVisible( true );
                    sectorLabel.setText( gameTexts.getCurrencyFormat( wData["betPrize"] ) );
                } else if ( check.isAvailable(wData[constants.KEY_TEXT_REFERENCE]) ) {
                    sectorLabel.setVisible( true );
                    sectorLabel.setText( gameTexts.getGameText(wData[constants.KEY_TEXT_REFERENCE]) );
                } else if ( check.isArray(wData["bonusesScenarioColors"]) ) {
                    const len = wData["bonusesScenarioColors"].length;
                    const color = wData["bonusesScenarioColors"][0];
                    sectorImage.setVisible( true );
                    const textureName = this.minigameColorsConfig[color][len];
                    sectorImage.setTextureByName( textureName[constants.KEY_TEXTURE_NAME] );
                }
            }
        }
    }

    show() {
        this.restartWheel();
        this.fadeIn();
    }

    hide() {
        this.fadeOut(1, () => {
            if ( check.isAvailable(this.winAnimation) ) {
                this.winAnimation.stopAnimation();
                this.winAnimation.recreateAnimation();
                this.winAnimation.setVisible(false);
                this.winAnimation = null;
            }
        });
    }

    restartWheel() {
        this.sectors.container.angle = 0;
        this.btnSpin.setEnabled( true );
    }

    onBtnSpinClick() {
        this.btnSpin.setEnabled( false );
        sender.publish(events.EVENT_UI_ON_MINIGAME_PLAY_PRESSED);
    }

    showWinning( sectorNum ) {

        const sector = this.sectors.getComponentByName( "sector" + sectorNum );

        this.sectors.container.angle = 0;

        const params = this.descriptor["wheelParameters"];

        const duration = params["duration"];
        const ease = params["ease"];
        const numberOfTurns = params["numberOfTurns"];
        const maxAngle = numberOfTurns*360;
        const sectorAngle = maxAngle - sector.descriptor.angle;

        gsap.to( this.sectors.container, {duration:duration, angle:sectorAngle, ease: ease, onComplete: ()=>{
                this.showWinningItem( sectorNum );
            }
        } );

        sounds.playSoundObject( this.soundStart );
    }

    showWinningItem( sectorNum ) {
        const sector = this.sectorsItems[sectorNum];
        sector.addToStage();
        const sectorLabel = sector.getComponentByName("tfWin");
        const sectorImage = sector.getComponentByName("imgWin");

        const winDisplayObject = sectorLabel.isVisible() ? sectorLabel.labelText : sectorImage.sprite;

        this.winAnimation = sector.getComponentByName("winAnimation");
        this.winAnimation.setAnimationById( constants.KEY_ANIMATION );

        sender.publish(events.EVENT_ON_MINIGAME_WIN);

        // winDisplayObject.filters = [new GlowFilter({
        //     distance: 50,
        //     color: 0xFAC816
        // })];

        const tl = gsap.timeline();
        tl.to( winDisplayObject.scale, { duration: 3, x:1.3, y:1.3 } );
        tl.to( winDisplayObject.scale, { duration: 0.1, x:1, y:1, onComplete: () => {
                this.complete();
            }
        } );

        sounds.playSoundObject( this.soundWin );
    }

    complete() {
        sender.publish(events.EVENT_ON_MINIGAME_COMPLETE);
        this.hide();
    }
}