import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import CFactory from "./CFactory";
import {
    ButtonModel,
    ButtonStateModel,
    ComponentModel, TextModel
} from "../models/PropertiesModels";
import CText from "./CText";

export default class CButton extends PIXI.Sprite {
    properties:ButtonModel;
    setProperties( props:ButtonModel ) {};
    removeOrientationEvent() {};

    private _textureNormal:PIXI.Texture;
    private _textureOver:PIXI.Texture;
    private _textureDown:PIXI.Texture;
    private _textureDisable:PIXI.Texture;

    private _scaleNormal:PIXI.IPointData = null;
    private _scaleOver:PIXI.IPointData = null;
    private _scaleDown:PIXI.IPointData = null;
    private _scaleDisable:PIXI.IPointData = null;

    private _textPropsNormal:ComponentModel = null;
    private _textPropsOver:ComponentModel = null;
    private _textPropsDown:ComponentModel = null;
    private _textPropsDisable:ComponentModel = null;

    state:string = constants.KEY_NORMAL;

    protected _btnText: CText;

    protected _actionOver: Function = null;
    protected _actionOut: Function = null;
    protected _actionDown: Function = null;
    protected _actionUp: Function = null;

    constructor( props: ButtonModel ) {
        super();


        const stateNorm:ButtonStateModel = props.states.normal;
        this._textureNormal = Resource.getTexture( stateNorm.texture );
        this._scaleNormal = stateNorm.scale;
        this._textPropsNormal = stateNorm.btnText;

        const stateOver:ButtonStateModel = props.states.over;
        if ( stateOver ) {
            this._textureOver = Resource.getTexture( stateOver.texture );
            this._scaleOver = stateOver.scale;
            this._textPropsOver = stateOver.btnText;
        }

        const stateDown:ButtonStateModel = props.states.down;
        if ( stateDown ) {
            this._textureDown = Resource.getTexture( stateDown.texture );
            this._scaleDown = stateDown.scale;
            this._textPropsDown = stateDown.btnText;
        }

        const stateDisable:ButtonStateModel = props.states.disable;
        if ( stateDisable ) {
            this._textureDisable = Resource.getTexture( stateDisable.texture );
            this._scaleDisable = stateDisable.scale;
            this._textPropsDisable = stateDisable.btnText;
        }

        this.texture = this._textureNormal;

        this.setEnabled( props.enabled );
        this.setState( props.state||constants.KEY_NORMAL );

        if ( this._scaleNormal ) {
            this.scale = this._scaleNormal;
        }

        this.setProperties( props );

        if ( props.btnText ) {
            this._btnText = CFactory.getNewComponent(props.btnText);
            this.addChild(this._btnText);
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
                this.texture = this._textureNormal;
                this.updateBtnText( this._textPropsNormal );
                break;
            case constants.KEY_OVER:
                this.texture = this._textureOver||this._textureNormal;
                this.updateBtnText( this._textPropsOver );
                break;
            case constants.KEY_DOWN:
                this.texture = this._textureDown||this._textureNormal;
                this.updateBtnText( this._textPropsDown );
                break;
            case constants.KEY_DISABLE:
                this.texture = this._textureDisable||this._textureNormal;
                this.updateBtnText( this._textPropsDisable );
                break;
        }
    }

    updateBtnText(props:ComponentModel):void {
        if ( this._btnText && props ) {
            Object.assign(this._btnText, props);
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

Mixin.applyMixins( CButton, [CBase] );