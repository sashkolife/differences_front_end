import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import CFactory from "./CFactory";
import {ContainerModel} from "../models/PropertiesModels";

export default class CContainer extends PIXI.Container {
    properties:ContainerModel;
    setProperties( props:ContainerModel ) {}
    removeOrientationEvent() {}

    constructor( props?: ContainerModel ) {
        super();

        this.setProperties(props);

        this.addChildren();

        this.addMask();
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this.removeOrientationEvent();
        super.destroy(_options);
    }

    public addChildren() : void {
        if ( this.properties && this.properties.children ) {

            this.properties.children.forEach( (props:any) => {

                let component: any = this.getNewComponentByType( props );

                if ( !component ) {
                    component = this.getNewComponentByName( props );
                }

                if ( component ) {
                    this.addChild( component );
                }

            } );
        }
    }

    public getNewComponentByType( props:any ) : any {
        return CFactory.getNewComponent( props );
    }

    /**
     * Override this method
     */
    public getNewComponentByName( props: any ) : any {
        return null;
    }

    public getComponentByName( name: string ) : any {
        return this.children.find( (component:any) => {
            return (component.properties && component.properties.name == name) || (component.name && component.name == name);
        });
    }

    public getComponentsByType( type: string ): any[] {
        return this.children.filter((component:any) => {
            return component.properties && component.properties.type == type;
        });
    }

    public getComponents( filterStr?: string ): any[] {
        if ( !filterStr ) {
            return this.children as any[];
        }
        return this.children.filter((component:any) => {
            return component.properties && component.properties.name && component.properties.name.indexOf(filterStr) !== -1;
        });
    }

    public addMask() : void {
        if ( this.properties.mask ) {
            this.mask = this.getComponentByName( this.properties.mask);
        }
    }
}

Mixin.applyMixins( CContainer, [CBase] );