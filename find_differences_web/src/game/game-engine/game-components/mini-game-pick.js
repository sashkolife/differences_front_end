import { gsap } from 'gsap';
import ContainerBase from "../../../components/container-base.js";
import * as check from "../../../utils/Check.ts";
import * as constants from "../../../constants/constants.js";
import * as gameTexts from "../../../data/Localization.ts";
import * as input from "../../../constants/input.js";
import {isPort} from "../../../utils/orientation.js";
import * as sender from "../../../utils/Sender.js";
import * as events from "../../../constants/events.js";
import * as sounds from "../../../data/Sounds.ts";

export class MiniGamePick extends ContainerBase {
    constructor( stage, descriptor, mgColorsConfig ) {
        super(stage, descriptor);

        this.soundStart = descriptor[constants.KEY_SOUNDS][constants.SOUND_START];
        this.soundWin = descriptor[constants.KEY_SOUNDS][constants.SOUND_WIN];
        this.pickParameters = descriptor["pickParameters"];

        this.minigameColorsConfig = mgColorsConfig;
        this.wins = null;
        this.buttons = null;
        this.pickingData = null;
        this.clickItem = null;
        this.winAnimation = null;

        this.init();
    }

    onInitComplete() {
        super.onInitComplete();

        this.wins = this.getComponentsByName( "win" );

        this.buttons = [];
        this.wins.forEach( winItem => {
            const btn = winItem.getComponentByName( "button" );
            btn.setAction( this.onButtonClick.bind(this) );
            this.buttons.push( btn );
        });
    }

    prepare( pickData ) {
        this.pickingData = pickData;
        for ( let i = 0; i < this.wins.length; i++ ) {
            if ( check.isAvailable(pickData[i]) ) {
                this.setItem( this.wins[i], pickData[i] );
            }
        }

        setTimeout( () => {
            this.showButtons();
        }, this.pickParameters["showButtonsWait"] );
    }

    showButtons() {
        this.wins.forEach( item => {
            const itemLabel = item.getComponentByName("tfWin");
            const itemImage = item.getComponentByName("imgWin");
            const btn = item.getComponentByName( "button" );
            btn.fadeIn();
            if ( itemLabel.isVisible() ) {
                itemLabel.fadeOut();
            }
            if ( itemImage.isVisible() ) {
                itemImage.fadeOut();
            }
        });

        setTimeout(() => {
            this.shuffleItems();
        }, this.pickParameters["shuffleWait"] );
    }

    setItem( item, picData ) {

        const itemLabel = item.getComponentByName("tfWin");
        const itemImage = item.getComponentByName("imgWin");
        const btn = item.getComponentByName("button");
        btn.setEnabled(false);
        btn.setAlpha(0);

        itemLabel.setVisible(false);
        itemImage.setVisible(false);
        itemLabel.setAlpha(1);
        itemImage.setAlpha(1);

        if ( picData[constants.KEY_NAME].startsWith( "instantWin" ) ) {
            itemLabel.setVisible( true );
            itemLabel.setText( gameTexts.getCurrencyFormat( picData["betPrize"] ) );
        } else if ( check.isAvailable(picData[constants.KEY_TEXT_REFERENCE]) ) {
            itemLabel.setVisible( true );
            itemLabel.setText( gameTexts.getGameText(picData[constants.KEY_TEXT_REFERENCE]) );
        } else if ( check.isArray(picData["bonusesScenarioColors"]) ) {
            const len = picData["bonusesScenarioColors"].length;
            const color = picData["bonusesScenarioColors"][0];
            itemImage.setVisible( true );
            const textureName = this.minigameColorsConfig[color][len];
            itemImage.setTextureByName( textureName[constants.KEY_TEXTURE_NAME] );
        }

        item.onOrientationChange();
        item.setVisible( true );
    }

    setWinItem( winItem, picData ) {
        this.setItem( winItem, picData );

        // winItem.getComponentsContainer().filters = [new GlowFilter({
        //     distance: 50,
        //     color: 0xFAC816
        // })];

        this.winAnimation = winItem.getComponentByName("winAnimation");
        this.winAnimation.setAnimationById(constants.KEY_ANIMATION);
    }

    shuffleItems() {
        for ( let i = 0; i < this.wins.length; i++ ) {
            const winItem = this.wins[i];
            const sectorLabel = winItem.getComponentByName("tfWin");
            const sectorImage = winItem.getComponentByName("imgWin");

            if ( sectorLabel.isVisible() ) {
                sectorLabel.fadeOut();
            }
            if ( sectorImage.isVisible() ) {
                sectorImage.fadeOut();
            }

            const tl = gsap.timeline( { onComplete: (idx) => {
                if ( idx === this.wins.length -1 ) {
                    this.enableButtons();
                }
            }, onCompleteParams: [i] } );
            tl.to( winItem.container, {
                duration: this.pickParameters["shuffleDuration"],
                x: this.pickParameters["shufflePos"][constants.KEY_X],
                y: this.pickParameters["shufflePos"][constants.KEY_Y]
            } );
            tl.to( winItem.container, {
                delay: this.pickParameters["shuffleDelay"],
                duration: this.pickParameters["shuffleDuration"],
                x: isPort() ? winItem.portX : winItem.landX, y: isPort() ? winItem.portY : winItem.landY
            } );
        }
    }

    onButtonClick( btn ) {
        this.disableButtons();
        sender.publish(events.EVENT_UI_ON_MINIGAME_PLAY_PRESSED);
        // this.showWinning(1, this.pickingData[3] );

        this.wins.forEach( winItem => {
            const btnItem = winItem.getComponentByName( "button" );
            if ( btn === btnItem ) {
                this.clickItem = winItem;
            }
        });

        sounds.playSoundObject( this.soundStart );
    }

    disableButtons() {
        this.buttons.forEach( btn => btn.setEnabled(false));
    }

    enableButtons() {
        this.buttons.forEach( btn => btn.setEnabled(true) );
    }

    show() {
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

    showWinning( pickNum ) {

        const btn = this.clickItem.getComponentByName("button");
        btn.setVisible(false);

        const pickData = this.pickingData[pickNum];

        this.setWinItem( this.clickItem, pickData, true );

        sounds.playSoundObject( this.soundWin );

        sender.publish(events.EVENT_ON_MINIGAME_WIN);

        setTimeout( ()=>{
            this.complete();
        }, 2000);
    }

    complete() {
        sender.publish(events.EVENT_ON_MINIGAME_COMPLETE);
        this.hide();
    }
}