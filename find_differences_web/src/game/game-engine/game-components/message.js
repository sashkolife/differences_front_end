import { gsap } from 'gsap';
import * as constants from "../../../constants/constants.js";
import ContainerBase from "../../../components/container-base.js";
import * as check from "../../../utils/Check.ts";

class Message extends ContainerBase {
    constructor( stage, descriptor, callback ) {
        super( stage, descriptor );

        this.onHideCallback = callback;

        this.okButton = null;

        this.init();
    }

    onInitComplete() {
        super.onInitComplete();

        this.okButton.setAction( this.onOkButton.bind(this) );
    }

    hide() {
        this.okButton.setEnabled(false);
        if ( check.isFunction(this.onHideCallback) ) {
            this.onHideCallback( this.name );
        }
        const hideTweens = this.descriptor[constants.KEY_HIDE_TWEENS];
        const tween = gsap.fromTo( this.container, hideTweens[constants.KEY_FROM], hideTweens[constants.KEY_TO] );
        tween.eventCallback( "onComplete", () => {
            this.destroy();
        } );

    }

    onOkButton() {
        this.hide();
    }
}

export default Message;