import {URL_JSON_PROPERTIES} from "../constants/urls";
import * as constants from "../constants/constants";

export default class Properties {
    private static _data : any = null;

    public static async load() {
        const loader: any = await fetch(URL_JSON_PROPERTIES);
        this._data = await loader.json();
    }

    public static get( key: string ) : any {
        const keyArr:Array<string> = key.split(".");
        if ( keyArr.length > 1 ) {
            let data:any = this._data[keyArr[0]];
            for ( let i:number = 1; i < keyArr.length; i++ ) {
                data = data[keyArr[i]];
            }
            return data;
        }

        return this._data[key];
    }

    public static findAllByType( type: string, obj?: any ) : Array<any> {
        const objects: Array<any> = [];
        const findRecursively:Function = ( o: any ) => {
            if ( o.children ) {
                o.children.forEach( (c:any) => {
                    if ( c.type == type ) {
                        objects.push( c );
                    }
                    findRecursively( c );
                } );
            }
        }

        if ( obj ) {
            findRecursively(obj);
        } else {
            for ( let key in this._data ) {
                findRecursively(this._data[key]);
            }
        }

        return objects;
    }

    public static findByName( name: string, obj?: any ) : any {
        let fObj : any = null;
        const findRecursively:Function = ( o: any ) => {
            if ( o.children ) {
                for (let i: number = 0; i < o.children.length; i++) {
                    if ( o.children[i].name == name) {
                        fObj = o.children[i];
                        break;
                    }
                    if ( !fObj ) {
                        findRecursively(o.children[i]);
                    }
                }
            } else {
                for (let key in o) {
                    if ( !fObj ) {
                        findRecursively(o[key]);
                    }
                }
            }
        }

        findRecursively( obj||this._data );

        return fObj;
    }
}