
export default class EventBus {

    private static _subscriptions : any = {};

    public static subscribe( eventType:string, callback:Function ) : any {

        if ( !this._subscriptions[eventType] ) {
            this._subscriptions[eventType] = new Array<Function>();
        }

        this._subscriptions[eventType][this._subscriptions[eventType].length] = callback;

        return {
            unsubscribe: () => {
                const index = this._subscriptions[eventType].indexOf( callback );
                if ( index >= 0 ) {
                    this._subscriptions[eventType].splice(index, 1);
                }
                if (this._subscriptions[eventType].length === 0) delete this._subscriptions[eventType];
            }
        }
    }

    public static publish( eventType:string, arg?:any ) : void {
        if ( !this._subscriptions[eventType] ) {
            return;
        }

        (this._subscriptions[eventType] as Array<Function>).forEach( callback => callback( arg ) );
    }
}