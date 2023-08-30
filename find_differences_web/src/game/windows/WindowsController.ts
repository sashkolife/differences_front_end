import * as PIXI from 'pixi.js';
import {BaseWindow} from "./BaseWindow";

export default class WindowsController {

    private static _instance: WindowsController;

    public static instance(): WindowsController {
        return this._instance;
    }

    private _windows:any = {};

    constructor( private _stage: PIXI.Container ) {
        if ( !WindowsController._instance ) {
            WindowsController._instance = this;
        }
    }


    show( wndClass: typeof BaseWindow, params?: any ) : BaseWindow {
        const wnd: BaseWindow = new wndClass();

        const name:string = wnd.getName();

        if ( this._windows[name] ) {
            console.log("Window "+name+ " is shown.");
            return;
        }

        this._windows[name] = wnd;

        this._stage.addChild(wnd);

        wnd.show( params );

        return wnd;
    }

    hide( wnd : BaseWindow ) : void {

        if ( wnd ) {
            const wndName:string = wnd.getName();
            delete this._windows[wndName];

            wnd.removeFromParent();
            wnd.destroy( {children:true} );
        }


    }
}
