import ContainerBase from "../../../components/container-base.js";
import * as sender from "../../../utils/Sender.js";
import * as events from "../../../constants/events.js";
import {getCurrencyFormat} from "../../../data/Localization.ts";
import * as check from "../../../utils/Check.ts";
import * as constants from "../../../constants/constants.js";
import * as sounds from "../../../data/Sounds.ts";

export class TableInstantWins extends ContainerBase {
    constructor(stage, descriptor, iwConfig) {
        super(stage, descriptor);

        this.soundWin = descriptor[constants.KEY_SOUNDS][constants.SOUND_WIN];

        this.instantWinsConfig = iwConfig;

        this.winAnimation = null;

        this.init();

    }

    onBetChanged() {
        for ( let i = 0; i < this.instantWinsConfig.length; i++ ) {
            const prizeItem = this.getComponentByName("prize"+i);
            if ( check.isAvailable(prizeItem) ) {
                const tfPrize = prizeItem.getComponentByName("tfPrize");
                tfPrize.setText(getCurrencyFormat(this.instantWinsConfig[i]["betPrize"]));
            }
        }
    }

    showWinning( winningsData ) {
        winningsData.forEach( winData => {
            const prizeIndex = this.instantWinsConfig.findIndex( value => value === winData );
            if ( prizeIndex !== -1 ) {
                const prizeItem = this.getComponentByName("prize"+prizeIndex);
                if ( check.isAvailable(prizeItem) ) {
                    this.winAnimation = prizeItem.getComponentByName("winAnimation");
                    this.winAnimation.onOrientationChange();
                    this.winAnimation.setAnimationById(constants.KEY_ANIMATION);
                    sounds.playSoundObject( this.soundWin );
                }
            }

        } );
    }

    hideWinning() {
        if ( check.isAvailable(this.winAnimation) ) {
            this.winAnimation.stopAnimation();
            this.winAnimation.recreateAnimation();
            this.winAnimation.setVisible(false);
            this.winAnimation = null;
        }
    }
}