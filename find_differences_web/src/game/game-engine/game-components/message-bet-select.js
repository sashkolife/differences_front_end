import ContainerBase from "../../../components/container-base.js";
import * as check from "../../../utils/Check.ts";
import * as constants from "../../../constants/constants.js";
import * as sender from "../../../utils/Sender.js";
import * as events from "../../../constants/events.js";
import {getCurrencyFormat} from "../../../data/Localization.ts";

export class MessageBetSelect extends ContainerBase {
    constructor( stage, descriptor, betLimits ) {
        super(stage, descriptor);

        this.betLimits = betLimits;
        this.limits = betLimits[constants.KEY_RANGE];
        this.denominationIndex = 0;

        this.btnMinus = null;
        this.btnMinusDisable = null;
        this.btnPlus = null;
        this.btnPlusDisable = null;
        this.tfBet = null;
        this.btnPlay = null;
        this.tfPurchaseAgain = null;

        this.init();

    }

    onInitComplete() {
        super.onInitComplete();

        this.btnMinus.setAction( this.onMinusClick.bind(this) );
        this.btnPlus.setAction( this.onPlusClick.bind(this) );
        this.btnPlay.setAction( this.onPlayClick.bind(this) );
    }

    onMinusClick( btn ) {
        this.denominationIndex--;
        if ( this.denominationIndex < 0 ) {
            this.denominationIndex = 0;
        }
        this.setBet();
    }

    onPlusClick( btn ) {
        this.denominationIndex++;
        if ( this.denominationIndex >= this.limits.length ) {
            this.denominationIndex = this.limits.length-1;
        }
        this.setBet();
    }

    onPlayClick( btn ) {
        this.enableButtons( false );
        this.hide();
        sender.publish( events.EVENT_UI_ON_PLAY_PRESSED );
    }

    setDefaultBet( outcomeDenomination ) {
        if ( outcomeDenomination >= 0 ) {
            this.denominationIndex = outcomeDenomination;
        } else if ( check.isAvailable(this.betLimits[constants.KEY_DEFAULT_POSITION]) ) {
            this.denominationIndex = this.betLimits[constants.KEY_DEFAULT_POSITION];
        }

        this.setBet();
    }

    setBet() {
        this.tfBet.setText( getCurrencyFormat(this.limits[this.denominationIndex]) );
        this.updateButtons();
        sender.publish(events.EVENT_ON_BET_CHANGE, {index:this.denominationIndex,value:this.limits[this.denominationIndex]} );
    }

    enableButtons( value ) {
        this.btnMinus.setEnabled( value );
        this.btnPlus.setEnabled( value );
        this.btnPlay.setEnabled( value );
    }

    updateButtons() {

        this.btnMinus.setVisible(true);
        this.btnPlus.setVisible(true);

        this.btnMinusDisable.setVisible(false);
        this.btnPlusDisable.setVisible(false);

        if ( this.denominationIndex === 0 ) {
            this.btnMinus.setVisible(false);
            this.btnMinusDisable.setVisible(true);
        }

        if ( this.denominationIndex === this.limits.length-1 ) {
            this.btnPlus.setVisible(false);
            this.btnPlusDisable.setVisible(true);
        }
    }

    hide() {
        this.fadeOut(1, () => {
            this.enableButtons( true );
            this.setVisible(false);
            this.tfPurchaseAgain.setVisible(true);
        });
    }

    show() {
        this.setVisible(true);
        this.fadeIn();
    }
}