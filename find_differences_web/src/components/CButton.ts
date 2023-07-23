import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import CContainer from "./CContainer";
import CSprite from "./CSprite";
import CText from "./CText";
import CFactory from "./CFactory";
import CBMText from "./CBMText";

export default class CButton extends PIXI.Sprite {
    properties:any;
    setProperties( props:any ) {};
    removeOrientationEvent() {};

    textureNormal:PIXI.Texture;
    textureOver:PIXI.Texture;
    textureDown:PIXI.Texture;
    textureDisable:PIXI.Texture;

    scaleNormal:any = null;
    scaleOver:any = null;
    scaleDown:any = null;
    scaleDisable:any = null;

    textPropsNormal:any = null;
    textPropsOver:any = null;
    textPropsDown:any = null;
    textPropsDisable:any = null;

    state:string = constants.KEY_NORMAL;

    btnText: any;

    protected _actionOver: Function = null;
    protected _actionOut: Function = null;
    protected _actionDown: Function = null;
    protected _actionUp: Function = null;

    constructor( props: any ) {
        super();

        const states:any = props[constants.KEY_STATES];

        const stateNorm:any = states[constants.KEY_NORMAL];
        this.textureNormal = Resource.getTexture( stateNorm[constants.KEY_TEXTURE] );
        this.scaleNormal = stateNorm[constants.KEY_SCALE];
        this.textPropsNormal = stateNorm[constants.KEY_BTN_TEXT];

        const stateOver:any = states[constants.KEY_OVER];
        if ( stateOver ) {
            this.textureOver = Resource.getTexture( stateOver[constants.KEY_TEXTURE] );
            this.scaleOver = stateOver[constants.KEY_SCALE];
            this.textPropsOver = stateOver[constants.KEY_BTN_TEXT];
        }

        const stateDown:any = states[constants.KEY_DOWN];
        if ( stateDown ) {
            this.textureDown = Resource.getTexture( stateDown[constants.KEY_TEXTURE] );
            this.scaleDown = stateDown[constants.KEY_SCALE];
            this.textPropsDown = stateDown[constants.KEY_BTN_TEXT];
        }

        const stateDisable:any = states[constants.KEY_DISABLE];
        if ( stateDisable ) {
            this.textureDisable = Resource.getTexture( stateDisable[constants.KEY_TEXTURE] );
            this.scaleDisable = stateDisable[constants.KEY_SCALE];
            this.textPropsDisable = stateDisable[constants.KEY_BTN_TEXT];
        }

        this.texture = this.textureNormal;

        this.setEnabled( props[constants.KEY_ENABLED] );
        this.setState( props[constants.KEY_STATE]||constants.KEY_NORMAL );

        if ( this.scaleNormal ) {
            this.scale = this.scaleNormal;
        }

        this.setProperties( props );

        if ( props[constants.KEY_BTN_TEXT] ) {
            this.btnText = CFactory.getNewComponent(props[constants.KEY_BTN_TEXT]);
            this.addChild(this.btnText);
        }

        const self : any = this;
        self.on("mouseover", this.onOver.bind(this));
        self.on("mouseout", this.onOut.bind(this));
        self.on("mouseoutoutside", this.onOut.bind(this));
        self.on("mousedown", this.onStart.bind(this));
        self.on("mouseup", this.onEnd.bind(this));
        self.on("mouseupoutside", this.onEndOutside.bind(this));
        self.on("touchstart", this.onStart.bind(this));
        self.on("touchend", this.onEnd.bind(this));
        self.on("touchendoutside", this.onEndOutside.bind(this));
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }

    setEnabled( value: boolean ) : void {
        (this as any).cursor = value ? "pointer" : "none";
        (this as any).interactive = value;
    }

    setState( newState: string = constants.KEY_NORMAL ): void {
        if ( this.state == newState ) {
            return;
        }

        this.state = newState;

        switch ( this.state ) {
            case constants.KEY_NORMAL:
                this.texture = this.textureNormal;
                this.updateBtnText( this.textPropsNormal );
                break;
            case constants.KEY_OVER:
                this.texture = this.textureOver||this.textureNormal;
                this.updateBtnText( this.textPropsOver );
                break;
            case constants.KEY_DOWN:
                this.texture = this.textureDown||this.textureNormal;
                this.updateBtnText( this.textPropsDown );
                break;
            case constants.KEY_DISABLE:
                this.texture = this.textureDisable||this.textureNormal;
                this.updateBtnText( this.textPropsDisable );
                break;
        }
    }

    updateBtnText(props:any):void {
        if ( this.btnText && props ) {
            for (let key in props ) {
                this.btnText[key] = props[key];
            }
        }
    }

    setActionUp(fn:Function):void {
        this._actionUp = fn;
    }

    setActionDown(fn:Function):void {
        this._actionDown = fn;
    }

    setActionOver(fn:Function):void {
        this._actionOver = fn;
    }

    setActionOut(fn:Function):void {
        this._actionOut = fn;
    }

    onOver(e:any): void {
        this.setState( constants.KEY_OVER );
        if ( this._actionOver != null ) {
            this._actionOver( this );
        }

    }

    onOut(e:any): void {
        this.setState( constants.KEY_NORMAL );
        if ( this._actionOut != null ) {
            this._actionOut( this );
        }
    }

    onStart(e:any): void {
        this.setState( constants.KEY_DOWN );
        if ( this._actionDown != null ) {
            this._actionDown( this );
        }
    }

    onEnd(e:any): void {
        this.setState( constants.KEY_NORMAL );
        if ( this._actionUp != null ) {
            this._actionUp( this );
        }
    }

    onEndOutside(e:any): void {
        this.setState( constants.KEY_NORMAL );
    }
}

Mixin.applyMixins( CButton, [CBase, PIXI.Sprite] );