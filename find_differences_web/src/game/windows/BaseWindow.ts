import * as PIXI from 'pixi.js';
import CContainer from "../../components/CContainer";
import Properties from "../../data/Properties";
import * as constants from "../../constants/constants";
import gsap from "gsap";
import WindowsController from "./WindowsController";
import CSprite from "../../components/CSprite";

export class BaseWindow extends CContainer {

    protected _params: any;

    protected _shadow: CSprite;
    protected _content: CContainer;

    constructor() {
        super();
        this._content = this.getComponentByName(constants.KEY_WINDOW_CONTENT);
        this._shadow = this.getComponentByName(constants.KEY_WINDOW_SHADOW);
        (this._shadow as any).interactive = true;
    }

    getName() : string {
        return constants.KEY_WINDOWS;
    }

    setProperties(props: any) {
        const wndProps: any = Properties.get(this.getName());
        super.setProperties( wndProps );
    }

    show( params?:any ) : void {
        this._params = params;

        if ( this._content.properties[constants.KEY_SHOW] ) {
            this._shadow.alpha = 0.1;
            gsap.to( this._shadow, {duration: 0.2, alpha:1});
            gsap.to( this._content, this._content.properties[constants.KEY_SHOW] ).then( this.onShowComplete.bind(this) );
        } else {
            this.onShowComplete();
        }
    }

    onShowComplete() : void {

    }

    hide() : void {
        (this as any).interactiveChildren = false;
        if ( this._content.properties[constants.KEY_HIDE] ) {
            gsap.to( this._shadow, {duration: this._content.properties[constants.KEY_HIDE].duration, alpha:0});
            gsap.to( this._content, this._content.properties[constants.KEY_HIDE] ).then( this.onHideComplete.bind(this) );
        } else {
            this.onHideComplete();
        }
    }

    onHideComplete() : void {
        WindowsController.instance().hide(this);
    }

}
