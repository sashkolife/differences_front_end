import * as PIXI from 'pixi.js';
import CContainer from "../../components/CContainer";
import Properties from "../../data/Properties";
import * as constants from "../../constants/constants";
import gsap from "gsap";
import WindowsController from "./WindowsController";
import CSprite from "../../components/CSprite";
import {ComponentModel, ContainerModel, ContentWindowModel} from "../../models/PropertiesModels";
import {WindowContent} from "./WindowContent";

export class BaseWindow extends CContainer {
    protected _params: any;

    protected _shadow: CSprite;
    protected _content: WindowContent;

    constructor() {
        super();
        this._content = this.getComponentByName(constants.KEY_WINDOW_CONTENT);
        this._shadow = this.getComponentByName(constants.KEY_WINDOW_SHADOW);
        (this._shadow as any).interactive = true;
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this._shadow);
        gsap.killTweensOf(this._content);
        super.destroy(_options);
    }

    getNewComponentByType( props:ComponentModel ) : any {
        if ( props.type === constants.COMPONENT_WINDOW_CONTENT ) {
            return new WindowContent( props as ContentWindowModel );
        }
        return super.getNewComponentByType( props );
    }

    public getName() : string {
        return constants.KEY_WINDOWS;
    }

    public setProperties(props: ContainerModel) {
        const wndProps: ContainerModel = Properties.get(this.getName())||props;
        super.setProperties( wndProps );
    }

    public show( params?:any ) : void {
        this._params = params;

        if ( this._content.properties.show ) {
            this._shadow.alpha = 0.1;
            gsap.to( this._shadow, {duration: 0.2, alpha:1});
            gsap.to( this._content, this._content.properties.show ).then( this.onShowComplete.bind(this) );
        } else {
            this.onShowComplete();
        }
    }

    protected onShowComplete() : void {

    }

    public hide() : void {
        (this as any).interactiveChildren = false;
        if ( this._content.properties.hide ) {
            gsap.to( this._shadow, {duration: this._content.properties.hide.duration, alpha:0});
            gsap.to( this._content, this._content.properties.hide ).then( this.onHideComplete.bind(this) );
        } else {
            this.onHideComplete();
        }
    }

    protected onHideComplete() : void {
        WindowsController.instance().hide(this);
    }

}
