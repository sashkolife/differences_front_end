import * as constants from "../../../constants/constants.js";
import * as sounds from "../../../data/Sounds.ts";
import * as sender from '../../../utils/Sender.js';
import * as check from "../../../utils/Check.ts";
import * as app from "../../../App.ts";
import * as gameTexts from "../../../data/Localization.ts";
import * as events from "../../../constants/events.js";
import ContainerBase from "../../../components/container-base.js";

export class UiPanelStandard extends ContainerBase {

    constructor(stage, descriptor) {

        super( stage, descriptor );

        this.soundOnButton = null;
        this.soundOffButton = null;
        this.infoButton = null;
        this.quitButton = null;
        this.clockLabel = null;
        this.balanceDynamicLabel = null;
        this.winDynamicLabel = null;
        this.totalBetDynamicLabel = null;
        this.winStaticLabel = null;
        this.totalBetStaticLabel = null;
        this.moneySwap = null;
        this.brandLogo = null;

        this.balance = 0;
        this.totalBet = 0;
        this.isHtmlPopupShown = false;

        this.backgroundMusic = descriptor[constants.KEY_SOUNDS][constants.SOUND_BACKGROUND_MUSIC];

        sender.subscribe( events.EVENT_ON_MONEY_SWAP, this.onEventMoneySwap.bind(this) );
        sender.subscribe(events.EVENT_ON_BET_CHANGE, this.setTotalBet.bind(this));

        this.init();
    }

    onInitComplete() {
        super.onInitComplete();

        this.soundOnButton.setAction( this.onToggleSound.bind(this) );
        this.soundOffButton.setAction( this.onToggleSound.bind(this) );
        this.infoButton.setAction( this.onInfoButtonClick.bind(this) );
        this.quitButton.setAction( this.onQuitButtonClick.bind(this) );

        this.isShowQuitButton();

        this.setSoundButtonOnOff();
        this.setBackgroundSoundOnOff();

        this.startClock();
    }

    onEventMoneySwap() {
        this.moneySwap.setAnimationById( constants.KEY_ANIMATION );
    }

    isShowQuitButton() {
        if ( app.isShowQuitButton ) {
            sender.publish( events.EVENT_UI_ON_SHOW_QUIT_BUTTON );
        }
    }

    onShowQuitButton() {
        if ( check.isAvailable(this.quitButton) ) {
            this.quitButton.setVisible( true );
        }
    }

    startClock() {
        if ( check.isAvailable(this.clockLabel) ) {
            setInterval(() => {
                const now = new Date();
                this.clockLabel.setText( now.toLocaleTimeString("en-GB") );
            }, constants.CLOCK_UPDATE_INTERVAL );
        }
    }

    onInfoButtonClick() {
        sender.publish(events.EVENT_ON_HELP_OPEN);
    }

    onToggleSound() {
        sounds.setAllowAudio( !sounds.isAudioAllowed() );
        this.setSoundButtonOnOff();
        this.setBackgroundSoundOnOff();
        sender.publish( events.EVENT_ON_BACKGROUND_SOUND );
    }

    onQuitButtonClick() {
        sender.publish( events.EVENT_UI_ON_GAME_QUIT );
    }

    setSoundButtonOnOff() {
        if ( sounds.isAudioAllowed() ){
            this.soundOnButton.setVisible( true );
            this.soundOffButton.setVisible( false );
        } else {
            this.soundOnButton.setVisible( false );
            this.soundOffButton.setVisible( true );
        }
    }

    setBackgroundSoundOnOff() {
        if ( sounds.isAudioAllowed() ){
            sounds.playSoundObject( this.backgroundMusic );
        } else {
            sounds.stopSound( this.backgroundMusic[constants.KEY_SOUND_REF] );
        }
    }

    setBalance( amount ) {
        this.balance = amount;
        this.balanceDynamicLabel.setText( gameTexts.getCurrencyFormat(amount) );
    }

    checkIsBalanceSufficient() {
        return this.balance >= this.totalBet;
    }

    setWin( win ) {
        this.winDynamicLabel.setText( gameTexts.getCurrencyFormat(win) );
    }

    setTotalBet( betData ) {
         this.totalBet = betData.value;
         const totalBetStr = gameTexts.getCurrencyFormat(this.totalBet);
         this.totalBetDynamicLabel.setText( totalBetStr );
    }

    onMessageHide() {
        this.winDynamicLabel.setVisible(true);
        this.totalBetDynamicLabel.setVisible(true);
        this.winStaticLabel.setVisible(true);
        this.totalBetStaticLabel.setVisible(true);
        this.clockLabel.setVisible(true);
        this.brandLogo.setVisible(true);
    }
}
