import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import CFactory from "./CFactory";
import {
    ButtonModel,
    ButtonStateModel,
    ComponentModel
} from "../models/PropertiesModels";

export default class CButton extends PIXI.Sprite {
    properties:ButtonModel;
    setProperties( props:ButtonModel ) {};
    removeOrientationEvent() {};

    textureNormal:PIXI.Texture;
    textureOver:PIXI.Texture;
    textureDown:PIXI.Texture;
    textureDisable:PIXI.Texture;

    scaleNormal:PIXI.IPointData = null;
    scaleOver:PIXI.IPointData = null;
    scaleDown:PIXI.IPointData = null;
    scaleDisable:PIXI.IPointData = null;

    textPropsNormal:ComponentModel = null;
    textPropsOver:ComponentModel = null;
    textPropsDown:ComponentModel = null;
    textPropsDisable:ComponentModel = null;

    state:string = constants.KEY_NORMAL;

    btnText: any;

    protected _actionOver: Function = null;
    protected _actionOut: Function = null;
    protected _actionDown: Function = null;
    protected _actionUp: Function = null;

    constructor( props: ButtonModel ) {
        super();


        const stateNorm:ButtonStateModel = props.states.normal;
        this.textureNormal = Resource.getTexture( stateNorm.texture );
        this.scaleNormal = stateNorm.scale;
        this.textPropsNormal = stateNorm.btnText;

        const stateOver:ButtonStateModel = props.states.over;
        if ( stateOver ) {
            this.textureOver = Resource.getTexture( stateOver.texture );
            this.scaleOver = stateOver.scale;
            this.textPropsOver = stateOver.btnText;
        }

        const stateDown:ButtonStateModel = props.states.down;
        if ( stateDown ) {
            this.textureDown = Resource.getTexture( stateDown.texture );
            this.scaleDown = stateDown.scale;
            this.textPropsDown = stateDown.btnText;
        }

        const stateDisable:ButtonStateModel = props.states.disable;
        if ( stateDisable ) {
            this.textureDisable = Resource.getTexture( stateDisable.texture );
            this.scaleDisable = stateDisable.scale;
            this.textPropsDisable = stateDisable.btnText;
        }

        this.texture = this.textureNormal;

        this.setEnabled( props.enabled );
        this.setState( props.state||constants.KEY_NORMAL );

        if ( this.scaleNormal ) {
            this.scale = this.scaleNormal;
        }

        this.setProperties( props );

        if ( props.btnText ) {
            this.btnText = CFactory.getNewComponent(props.btnText);
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

Mixin.applyMixins( CButton, [CBase] );