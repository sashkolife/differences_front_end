import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import * as events from "../constants/events";
import {screenOrientation} from "../App";
import EventBus from "../utils/EventBus";
import Properties from "../data/Properties";

export default class ComponentBase {
    protected _displayObject:any;
    protected _properties: any;
    protected _parent: PIXI.Container;
    protected _onOrientationEvent:any;

    constructor( key : string, parent:PIXI.Container ) {

        this._properties = Properties.get(key);

        if ( this._properties ) {

            this._properties = Object.assign({}, this._properties);

            if (this._properties[constants.KEY_PORTRAIT] || this._properties[constants.KEY_LANDSCAPE]) {
                this._onOrientationEvent = EventBus.subscribe(events.EVENT_ON_ORIENTATION_CHANGED, this.onOrientationChange.bind(this));
            }

            if ( this._properties[constants.KEY_TYPE] == this.getType() ) {
                this.createDisplayObject();
                this.setParent( parent );
                this.setParameters();
            }
        }
    }

    public getType() : string {
        return constants.COMPONENT_CONTAINER;
    }

    protected createDisplayObject() : void {
        this._displayObject = new PIXI.Container();
    }


    public setParent( parent: PIXI.Container ) : void {
        this._parent = parent;
        if ( this._parent ) {
            this._parent.addChild(this._displayObject);
        } else {
            if ( this._displayObject.parent ) {
                this._displayObject.parent.removeChild(this._displayObject);
            }
        }
    }

    public onOrientationChange() : void {
        this.setParameters();
    }

    protected setParameters() : void {
        if ( !this._properties ) return;

        const allParams: any = {};

        const parameters : any = this._properties[constants.KEY_PARAMETERS];
        if ( parameters ) {
            for (let key in parameters) {
                allParams[key] = parameters[key];
            }
        }


        if ( screenOrientation === constants.KEY_PORTRAIT ) {
            const port : any = this._properties[constants.KEY_PORTRAIT];
            if ( port ) {
                for ( let key in port ) {
                    allParams[key] = port[key];
                }
            }
        }

        if ( screenOrientation === constants.KEY_LANDSCAPE ) {
            const land : any = this._properties[constants.KEY_LANDSCAPE];
            if ( land ) {
                for ( let key in land ) {
                    allParams[key] = land[key];
                }
            }
        }

        for ( let key in allParams ) {
            this.setParameter( key, allParams[key] );
        }
    }

    protected setParameter( key: string, data : any ) : void {
        if ( this._displayObject.hasOwnProperty(key) ) {
            this._displayObject[key] = data;
        }
    }
}