import CBase from "./CBase";
import Resource from "../data/Resource";
import * as PIXI from "pixi.js";
import * as constants from "../constants/constants";
import Mixin from "../utils/Mixin";
import CFactory from "./CFactory";

export default class CContainer extends PIXI.Container {
    properties:any;
    setProperties( props:any ) {}
    removeOrientationEvent() {}

    constructor( props?: any ) {
        super();

        this.setProperties(props);

        this.addChildren();

        this.addMask();
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {

        this.removeOrientationEvent();

        super.destroy(_options);
    }

    addChildren() : void {
        if ( this.properties && this.properties[constants.KEY_CHILDREN] ) {

            this.properties[constants.KEY_CHILDREN].forEach( (props:any) => {

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

    getNewComponentByType( props:any ) : any {
        return CFactory.getNewComponent( props );
    }

    /**
     * Override this method
     */
    getNewComponentByName( props: any ) : any {
        return null;
    }

    getComponentByName( name: string ) : any {
        return this.children.find( (component:any) => {
            return (component.hasOwnProperty(constants.KEY_PROPERTIES) && component[constants.KEY_PROPERTIES][constants.KEY_NAME] == name) ||
                (component.hasOwnProperty(constants.KEY_NAME) && component[constants.KEY_NAME] == name);
        });
    }

    getComponentsByType( type: string ): Array<any> {
        return this.children.filter((component:any) => {
            return component.hasOwnProperty(constants.KEY_PROPERTIES) && component[constants.KEY_PROPERTIES][constants.KEY_TYPE] == type;
        });
    }

    addMask() : void {
        if ( this.properties[constants.KEY_MASK] ) {
            this.mask = this.getComponentByName( this.properties[constants.KEY_MASK]);
        }
    }
}

Mixin.applyMixins( CContainer, [CBase, PIXI.Container] );