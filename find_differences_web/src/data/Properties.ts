import {URL_JSON_PROPERTIES} from "../constants/urls";

export default class Properties {
    private static _data : any = {};

    public static async load() {
        for (let i: number = 0; i < URL_JSON_PROPERTIES.length; i++) {
            const props: any = URL_JSON_PROPERTIES[i];
            const loader: any = await fetch(props.src);
            this._data[props.name] = await loader.json();
        }
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

    public static findByProperty( property: string, value: string, obj?: any ) : any {
        if (obj[property] && obj[property] == value) {
            return obj;
        } else if (obj.children) {
            for (let i: number = 0; i < obj.children.length; i++) {
                const fObj: any = this.findByProperty(property, value, obj.children[i]);
                if (fObj) return fObj;
            }
        }

        return null;
    }
}