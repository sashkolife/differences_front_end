import {SceneLobby} from "./SceneLobby";
import {CampaignModel, LevelModel, UserModel} from "../../models/ApiModels";
import {ContainerModel} from "../../models/PropertiesModels";
import * as constants from "../../constants/constants";
import Map from "../components/lobby/Map";
import LobbyStarsProgressBar from "../components/lobby/LobbyStarsProgressBar";
import BalanceBar from "../components/common/BalanceBar";
import CampaignMap from "../components/lobby/CampaignMap";
import CButton from "../../components/CButton";
import Api from "../../utils/Api";
import * as urls from "../../constants/urls";
import User from "../../data/User";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import WindowsController from "../windows/WindowsController";
import KeyReceivedWindow from "../windows/KeyReceivedWindow";
import CSprite from "../../components/CSprite";
import * as levelUtils from "../../utils/LevelsUtils";
import Campaigns from "../../data/Campaigns";

export class SceneCampaign extends SceneLobby {
    private _leaveBtn: CButton;

    private _campaignData: CampaignModel;
    protected _map : CampaignMap;
    constructor(props: ContainerModel, campaignData: CampaignModel) {
        super(props);
        this._campaignData = campaignData;

        this._leaveBtn = this.getComponentByName("leaveBtn");
        this._leaveBtn.setActionUp( this.onLeaveTouch.bind(this) );
    }

    public getNewComponentByName( props: any ): any {

        let comp: any = super.getNewComponentByName( props );

        const name: string = props[constants.KEY_NAME];

        if ( !comp && name ) {
            switch ( name ) {
                case "campaign_map":
                    comp = this._map = new CampaignMap(props);
            }
        }

        return comp;
    }

    init(afterLevel: boolean = false) : void {
        // this._map = new Map( this._properties["map"] );
        this._map.setCampaignData(this._campaignData);
        this._map.initMap();

        this.startUpdateLobby();
    }

    protected startUpdateLobby(): void {

        const levelsToUpdate: LevelModel[] = levelUtils.getUpdatedLevels(this._campaignData.levels);

        if ( levelsToUpdate && levelsToUpdate.length > 0 ) {
            window.setTimeout(()=>{

                this._map.setNewLevelsStars(levelsToUpdate);

                levelUtils.resetNewLevels(this._campaignData.levels);

                const newStarsCount: number = levelUtils.getLocationStars(this._campaignData.levels);
                this._lobbyStarsProgressBar.setStars(newStarsCount);

                this.onUpdateLobbyComplete();
            }, 1000);
        } else {
            this.onUpdateLobbyComplete();
        }
    }

    private onLeaveTouch(): void {
        EventBus.publish( events.EVENT_ON_CAMPAIGN_LEAVE );
    }

    protected onUpdateLobbyComplete(): void {
    }
}