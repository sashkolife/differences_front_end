import * as PIXI from "pixi.js";
import * as constants from "../../../constants/constants";
import CContainer from "../../../components/CContainer";
import CSprite from "../../../components/CSprite";
import MapLevel from "./MapLevel";
import LocationBackground from "./LocationBackground";
import Fence from "./Fence";
import gsap from "gsap";
import {ContainerModel} from "../../../models/PropertiesModels";
import CampaignButton from "./CampaignButton";

export default class MapLocation extends CContainer {

    private _ghost: CSprite;
    private _background: LocationBackground;
    private _activeMarker: CSprite;
    private _mapLevels: Array<MapLevel>;
    private _mapCampaigns: Array<CampaignButton>;
    private _fence: Fence;

    constructor( props: ContainerModel ) {
        super( props );

        this._ghost = this.getComponentByName("ghost");
        this._background = this.getComponentByName("background");
        this._activeMarker = this.getComponentByName("activeMarker");

        this._mapLevels = this.getComponentsByType( constants.COMPONENT_MAP_LEVEL );
        this._mapCampaigns = this.getComponentsByType( constants.COMPONENT_MAP_CAMPAIGN );

        this._fence = this.getComponentByName("fence");
        this._fence?.setId(props.id);
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
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
                return new LocationBackground( props, this.onBackLoaded.bind(this) );
            }
            if ( type == constants.COMPONENT_MAP_LEVEL ) {
                return new MapLevel( props );
            }
            if ( type == constants.COMPONENT_MAP_CAMPAIGN ) {
                return new CampaignButton( props );
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

    }

    getMapLevels(): Array<MapLevel> {
        return this._mapLevels;
    }

    getMapCampaigns(): Array<CampaignButton> {
        return this._mapCampaigns;
    }

    getFence() : Fence {
        return this._fence;
    }

    getMapLevelById(levelId: number): MapLevel {
        return this._mapLevels.find( (mLevel:MapLevel) => mLevel.getId() == levelId );
    }

    private onBackLoaded(): void {
        this._ghost.visible = false;
    }

}