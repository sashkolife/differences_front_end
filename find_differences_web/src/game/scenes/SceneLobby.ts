import * as PIXI from 'pixi.js';
import LobbyStarsProgressBar from "../components/lobby/LobbyStarsProgressBar";
import Map from "../components/lobby/Map";
import Properties from "../../data/Properties";
import CSlice9 from "../../components/CSlice9";
import CContainer from "../../components/CContainer";
import * as constants from "../../constants/constants";
import BalanceBar from "../components/common/BalanceBar";
import CButton from "../../components/CButton";
import Sounds from "../../data/Sounds";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import User from "../../data/User";
import {LevelModel, LocationModel, OpenLocationModel} from "../../models/ApiModels";
import Locations from "../../data/Locations";
import WindowsController from "../windows/WindowsController";
import KeyReceivedWindow from "../windows/KeyReceivedWindow";
import CSprite from "../../components/CSprite";
import OpenLocationWindow from "../windows/OpenLocationWindow";
import Api from "../../utils/Api";
import * as urls from "../../constants/urls";
import LocationClosedWindow from "../windows/LocationClosedWindow";
import ScreenBlock from "../components/common/ScreenBlock";
import LevelFinishWindow from "../windows/LevelFinishWindow";
import {ContainerModel} from "../../models/PropertiesModels";
import Campaigns from "../../data/Campaigns";
import * as levelUtils from "../../utils/LevelsUtils";

export class SceneLobby extends CContainer {
    protected _lobbyStarsProgressBar : LobbyStarsProgressBar;
    private _balanceBar : BalanceBar;
    private _soundOnBtn : CButton;
    private _soundOffBtn : CButton;
    private _playNowBtn : CButton;
    protected _map : Map;

    private _openLocationEvent: EventModel = null;

    constructor(props:ContainerModel) {
        super(props);

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");
        this._playNowBtn = this.getComponentByName("playNowBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );

        this._playNowBtn?.setActionUp( this.onPlayNowClick.bind(this) );
        this.updateSoundBtn();

        this._openLocationEvent = EventBus.subscribe(events.EVENT_ON_LOCATION_OPEN, this.onOpenLocation.bind(this));
    }

    init(afterLevel: boolean = false) : void {
        // this._map = new Map( this._properties["map"] );
        this._map.initMap();
        this._map.initCampaigns();

        this.setCurrentStars();

        this.startUpdateLobby();
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean): void {
        super.destroy(_options);
        this._openLocationEvent.unsubscribe();
        this._openLocationEvent = null;
    }

    public getNewComponentByName( props: any ): any {

        const name: string = props[constants.KEY_NAME];

        if ( name ) {
            switch ( name ) {
                case "map":
                    this._map = new Map(props);
                    return this._map;
                case "lobbyStarsProgressBar":
                    this._lobbyStarsProgressBar = new LobbyStarsProgressBar(props);
                    return this._lobbyStarsProgressBar;
                case "balanceBar":
                    this._balanceBar = new BalanceBar(props);
                    return this._balanceBar;
            }
        }

        return null;
    }

    private updateSoundBtn(): void {
        this._soundOnBtn.visible = Sounds.isAudioAllowed();
        this._soundOffBtn.visible = !Sounds.isAudioAllowed();
    }

    private onSoundSwitch(): void {
        Sounds.setAllowAudio(!Sounds.isAudioAllowed());
        this.updateSoundBtn();
    }

    private onPlayNowClick(): void {
        EventBus.publish( events.EVENT_ON_LEVEL_START );

        // WindowsController.instance().show(LevelFinishWindow, {"levelData": levelUtils.getLevelByID(User.levels, 1), "levelFinish": {
        //         spentTime:30,
        //         stars: 3,
        //         coins: 10,
        //         helps: 10
        //     }});

        // WindowsController.instance().show(KeyReceivedWindow, {stars:99, onCloseCallback: () => {
        //         this._map.scrollMapToFence(()=>{
        //             const key:CSprite = this._lobbyStarsProgressBar.getKey();
        //             this._map.moveKeyToFence( key, () => {
        //
        //             } );
        //         });
        //     }
        // });

        // WindowsController.instance().show(OpenLocationWindow, {onCloseCallback: async () => {
        //     const loader: Response = await Api.request(urls.URL_OPEN_LOCATION);
        //     const openLocData : OpenLocationModel = await loader.json() as OpenLocationModel;
        // }});

        // WindowsController.instance().show(LocationClosedWindow, {price:30,stars:20,seconds:1000,onCloseCallback: async () => {
        //     const loader: Response = await Api.request(urls.URL_OPEN_LOCATION);
        //     const openLocData : OpenLocationModel = await loader.json() as OpenLocationModel;
        // }});
    }

    protected setCurrentStars(): void {

    }

    protected startUpdateLobby(): void {
        const location: LocationModel = Locations.getLocationByID(User.location);
        const locationMaxStars: number = location.openNextStars;
        const locationStars: number = levelUtils.getLocationStars(User.levels, User.location);

        this._lobbyStarsProgressBar.setStarsMax(locationMaxStars, locationStars);
        if ( locationStars >= locationMaxStars ) {
            const fenceKey: CSprite = this._map.getCurrentKeyImg();
            fenceKey.visible = true;
        }

        const levelsToUpdate: LevelModel[] = levelUtils.getUpdatedLevels(User.levels);

        if ( levelsToUpdate && levelsToUpdate.length > 0 ) {

            window.setTimeout(()=>{

                this._map.setNewLevelsStars(levelsToUpdate);

                levelUtils.resetNewLevels(User.levels);

                const newStarsCount: number = levelUtils.getLocationStars(User.levels, User.location);
                this._lobbyStarsProgressBar.setStars(newStarsCount);

                if (locationStars < locationMaxStars && newStarsCount >= locationMaxStars) {
                    WindowsController.instance().show(KeyReceivedWindow, {stars:locationMaxStars, onCloseCallback: () => {
                            this._map.scrollMapToFence(()=>{
                                const key:CSprite = this._lobbyStarsProgressBar.getKey();
                                this._map.moveKeyToFence( key, () => {
                                    this.checkOnFenceOpen(newStarsCount);
                                } );
                            });
                        }
                    });
                } else {
                    this.checkOnFenceOpen(locationStars);
                }
            }, 1000);
        } else {
            this.checkOnFenceOpen(locationStars);
        }
    }

    private checkOnFenceOpen( starsCount: number ): void {
        if ( levelUtils.isLastLocationLevelComplete(User.levels, User.location) ) {
            this._map.setActiveFence(starsCount);
        }
        this.checkOnCampaignsOpen();
        this.onUpdateLobbyComplete();
    }

    private checkOnCampaignsOpen(): void {
        const newCampaigns: number[] = Campaigns.getNewCampaigns();
        if (newCampaigns && newCampaigns.length > 0) {
            this._map.scrollMapToCampaign(newCampaigns[0], ()=>{

            });
        }
    }

    private onOpenLocation(data:OpenLocationModel): void {
        if ( !data.error ) {
            ScreenBlock.hide();
            this._map.openLocation();
            this._lobbyStarsProgressBar.setStars(0);
        }
    }

    protected onUpdateLobbyComplete(): void {
        Campaigns.resetNewCampaigns();
    }
}
