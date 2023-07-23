import * as constants from "../constants/constants";
import {screenOrientation} from "../App";
import EventBus from "../utils/EventBus";
import * as events from "../constants/events";

export default class CBase {
    onOrientationEvent:any;
    properties:any;

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
            setAllProperties(this.properties[constants.KEY_PORTRAIT]);
        }

        if ( screenOrientation === constants.KEY_LANDSCAPE ) {
            setAllProperties(this.properties[constants.KEY_LANDSCAPE]);
        }

        const self:any = this;

        for ( let key in allProperties ) {
            self[key] = allProperties[key];
        }
    }

    public setProperties( props:any ) : void {
        if ( !props ) return;

        this.properties = props;

        if (this.properties[constants.KEY_PORTRAIT] || this.properties[constants.KEY_LANDSCAPE]) {
            this.onOrientationEvent = EventBus.subscribe(events.EVENT_ON_ORIENTATION_CHANGED, this.onOrientationChange.bind(this));
        } else {
            this.removeOrientationEvent();
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