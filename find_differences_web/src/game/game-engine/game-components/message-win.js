import ContainerBase from "../../../components/container-base.js";
import * as constants from "../../../constants/constants.js";
import * as check from "../../../utils/check.js";
import * as sounds from "../../../utils/sound-engine.js";

export class MessageWin extends ContainerBase {
    constructor(stage, descriptor) {
        super(stage, descriptor);

        this.soundWin = descriptor[constants.KEY_SOUNDS][constants.SOUND_WIN];

        this.winAnimation = null;
        this.labelWin = null;

        this.init();
    }

    onInitComplete() {
        super.onInitComplete();

        this.winAnimation.setCallback( this.onWinAnimationComplete.bind(this) );
    }

    show( winValue, callback ) {

        this.onHideCallback = callback;

        this.setVisible(true);
        this.winAnimation.recreateAnimation();
        this.winAnimation.setAnimationById(constants.KEY_WIN_FRAME);
        this.labelWin.addToStage();
        this.labelWin.start( 0, winValue );

        sounds.playSoundObject( this.soundWin );

        setTimeout(() => {
            this.labelWin.fadeOut(1.5);
        }, 3000 );
    }

    hide() {
        this.labelWin.setStaticText( 0 );
        this.labelWin.setAlpha( 1 );
        this.labelWin.setVisible( true );
        this.setVisible( false );
    }

    onWinAnimationComplete() {
        this.hide();
        if ( check.isFunction(this.onHideCallback) ) {
            this.onHideCallback();
            this.clearCallback();
        }
    }

    clearCallback() {
        this.onHideCallback = null;
    }
}