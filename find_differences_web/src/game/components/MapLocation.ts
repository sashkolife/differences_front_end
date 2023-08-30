import * as PIXI from "pixi.js";
import * as constants from "../../constants/constants";
import CContainer from "../../components/CContainer";
import CSprite from "../../components/CSprite";
import MapLevel from "./MapLevel";
import LocationBackground from "./LocationBackground";
import Fence from "./Fence";
import gsap from "gsap";
import {ContainerModel} from "../../models/PropertiesModels";

export default class MapLocation extends CContainer {

    private _background: LocationBackground;
    private _activeMarker: CSprite;
    private _mapLevels: Array<MapLevel>;
    private _fence: Fence;
    private _arrow: CSprite;

    constructor( props: ContainerModel ) {
        super( props );

        this._background = this.getComponentByName("background");
        this._activeMarker = this.getComponentByName("activeMarker");

        this._mapLevels = this.getComponentsByType( constants.COMPONENT_MAP_LEVEL );

        this._fence = this.getComponentByName("fence");
        this._arrow = this.getComponentByName("arrow");
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this._arrow);
        super.destroy(_options);
    }

    getNewComponentByType( props:any ) : any {
        const comp:any = super.getNewComponentByType(props);
        if ( !comp ) {
            const type: string = props[constants.KEY_TYPE];
            if ( !type ) {
                return null;
            }

            if ( type == constants.COMPONENT_LOCATION_BACKGROUND ) {
                return new LocationBackground( props );
            }
            if ( type == constants.COMPONENT_MAP_LEVEL ) {
                return new MapLevel( props );
            }
            if ( type == constants.COMPONENT_FENCE ) {
                return new Fence( props );
            }
        }
        return comp;
    }

    load() : void {
        this._background.load();
    }

    stop() : void {
        this._background.stop();
    }

    setMarkerToLevel( mapLevel:MapLevel ) {
        this._activeMarker.visible = true;
        this._activeMarker.x = mapLevel.x;
        this._activeMarker.y = mapLevel.y;

        this._arrow.visible = true;
        gsap.killTweensOf(this._arrow);
        this._arrow.x = mapLevel.x;
        this._arrow.y = mapLevel.y + this._arrow.properties.y;
        gsap.to( this._arrow.position, { duration:0.5, "y": "+=10", yoyo: true, repeat: -1 } );
    }

    getMapLevels(): Array<MapLevel> {
        return this._mapLevels;
    }

    getFence() : Fence {
        return this._fence;
    }

}