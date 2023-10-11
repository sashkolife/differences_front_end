import * as constants from "../constants/constants";
import {screenOrientation} from "../App";
import EventBus, {EventModel} from "../utils/EventBus";
import * as events from "../constants/events";
import {ComponentModel} from "../models/PropertiesModels";

export default class CBase {
    onOrientationEvent:EventModel;
    properties:ComponentModel;

    public onOrientationChange() : void {
        const allProperties: any = {};

        const setAllProperties : Function = ( params : any ) => {
            if ( params ) {
                for (let key in params) {
                    if ( constants.AVAILABLE_PARAMETERS.indexOf(key) != -1 ) {
                        allProperties[key] = params[key];
                    }
                }
            }
        }

        setAllProperties(this.properties);

        if ( screenOrientation === constants.KEY_PORTRAIT ) {
            setAllProperties(this.properties.portrait);
        }

        if ( screenOrientation === constants.KEY_LANDSCAPE ) {
            setAllProperties(this.properties.landscape);
        }

        const self:any = this;

        for ( let key in allProperties ) {
            self[key] = allProperties[key];
        }
    }

    public setProperties( props:ComponentModel ) : void {
        if ( !props ) return;

        this.properties = props;

        this.removeOrientationEvent();

        if (this.properties.portrait || this.properties.landscape) {
            this.onOrientationEvent = EventBus.subscribe(events.EVENT_ON_ORIENTATION_CHANGED, this.onOrientationChange.bind(this));
        }

        this.onOrientationChange();
    }

    public removeOrientationEvent() : void {
        if ( this.onOrientationEvent ) {
            this.onOrientationEvent.unsubscribe();
            this.onOrientationEvent = null;
        }
    }
}