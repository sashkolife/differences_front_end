import * as urls from "../constants/urls";
import {
    UserModel,
    ConfigModel,
    LoginModel,
    OpenLocationModel, LevelModel
} from "../models/ApiModels";
import Api from "../utils/Api";
import Shop from "./Shop";
import Locations from "./Locations";
import EventBus from "../utils/EventBus";
import * as events from "../constants/events";
import Campaigns from "./Campaigns";
import * as levelUtils from "../utils/LevelsUtils";

export default class User {
    private static _user : UserModel = {};
    private static _levels : LevelModel[] = null;
    private static _config : ConfigModel;

    private static _nextLocationInterval: any = null;
    private static _penaltyInterval: any = null;

    public static async load() {
        let id: string = null;
        try {
            id = window.localStorage.getItem("userId");
        } catch (err) {
            console.log("Get local store userId Error", err);
        }

        const loader: Response = await Api.request(urls.URL_LOGIN+(id||""));
        const loginData : LoginModel = await loader.json() as LoginModel;

        this._levels = loginData.levels;

        Shop.load(loginData.shop);
        Locations.load(loginData.locations);
        Campaigns.load(loginData.campaigns);

        this._config = loginData.config;

        this.update( loginData.user );

        try {
            window.localStorage.setItem("userId", this._user.id.toString());
        } catch (err) {
            console.log("Set local store userId Error", err);
        }
    }

    public static async openLocation() {
        const loader: Response = await Api.request(urls.URL_OPEN_LOCATION);
        const openLocData : OpenLocationModel = await loader.json() as OpenLocationModel;
        if ( !openLocData.error ) {
            this.update(openLocData.user);
            EventBus.publish(events.EVENT_ON_LOCATION_OPEN, openLocData);
        }
    }

    public static update( data: UserModel ) : void {
        if ( data ) {
            Object.assign(this._user, data);
            this.setCurrentLocation();
            this.setOpenLocationTimer();
            this.setPenaltyTimer();
        }
    }

    public static get user() : UserModel {
        return this._user;
    }

    public static get level() : number {
        return this._user.level;
    }

    public static get levels(): LevelModel[] {
        return this._levels;
    }

    public static get location() : number {
        return this._user.location;
    }

    public static get balance() : number {
        return this._user.coins;
    }

    public static get nextLocationTimer() : number {
        return this._user.nextLocationTimer;
    }

    public static get helps() : number {
        return this._user.helps;
    }

    public static get token() : string {
        return this._user?.token;
    }

    public static get configHelpPrice() : number {
        return this._config.helpPrice;
    }

    public static get configExtraTimePrice() : number {
        return this._config.extraTimePrice;
    }

    public static setCurrentLocation() : void {
        const level: LevelModel = levelUtils.getLevelByID(this.levels, this.level);
        this._user.location = level.location;
    }

    public static get playedPictureNum() : number {
        return this._user.playedPictureNum;
    }

    public static get playedLevelId() : number {
        return this._user.playedLevelId;
    }
    public static get playedCampaignId() : number {
        return this._user.playedCampaignId;
    }

    public static get penaltySeconds() : number {
        return this._user.penaltySeconds;
    }

    private static setOpenLocationTimer(): void {
        if ( this._user.nextLocationTimer > 0 ) {

            clearInterval(this._nextLocationInterval);
            this._nextLocationInterval = null;

            this._nextLocationInterval = setInterval(() => {
                this._user.nextLocationTimer -= 1000;
                if ( this._user.nextLocationTimer <= 0 ) {
                    this._user.nextLocationTimer = 0;
                    clearInterval(this._nextLocationInterval);
                    this._nextLocationInterval = null;
                }

                EventBus.publish(events.EVENT_ON_LOCATION_OPEN_TIMER_TICK, this._user.nextLocationTimer);

                if ( this._user.nextLocationTimer <= 0 ) {
                    EventBus.publish(events.EVENT_ON_LOCATION_OPEN_TIMER_END);
                }
            }, 1000);
        }
    }

    private static setPenaltyTimer(): void {
        if ( this._user.penaltySeconds > 0 ) {

            clearInterval(this._penaltyInterval);
            this._penaltyInterval = null;

            this._penaltyInterval = setInterval(() => {
                this._user.penaltySeconds -= 1;
                if ( this._user.penaltySeconds <= 0 ) {
                    this._user.penaltySeconds = 0;

                    clearInterval(this._penaltyInterval);
                    this._penaltyInterval = null;
                }

                EventBus.publish(events.EVENT_ON_PENALTY_TIMER_TICK, this._user.penaltySeconds);

                if ( this._user.penaltySeconds <= 0 ) {
                    EventBus.publish(events.EVENT_ON_PENALTY_TIMER_END);
                }
            }, 1000);
        }
    }
}