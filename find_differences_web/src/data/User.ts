import * as urls from "../constants/urls";
import {
    StartModel,
    PlayedLevelModel,
    UserLevelModel,
    UserModel,
    ConfigModel,
    LoginModel,
    OpenLocationModel, LevelModel
} from "../models/ApiModels";
import Api from "../utils/Api";
import Levels from "./Levels";
import Shop from "./Shop";
import Locations from "./Locations";
import EventBus from "../utils/EventBus";
import * as events from "../constants/events";

export default class User {
    private static _user : UserModel = {};
    private static _playedLevel : PlayedLevelModel;
    private static _config : ConfigModel;

    public static async load() {
        let id: string = null;
        try {
            id = window.localStorage.getItem("userId");
        } catch (err) {
            console.log("Get local store userId Error", err);
        }

        const loader: Response = await Api.request(urls.URL_LOGIN+(id||""));
        const loginData : LoginModel = await loader.json() as LoginModel;

        Levels.load(loginData.levels);
        Shop.load(loginData.shop);
        Locations.load(loginData.locations);

        this._playedLevel = loginData.playedLevel;
        this._config = loginData.config;

        this.update( loginData.user );

        try {
            window.localStorage.setItem("userId", this._user.id.toString() );
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
        }
    }

    public static get user() : UserModel {
        return this._user;
    }

    public static get level() : number {
        return this._user.level;
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
        const level: LevelModel = Levels.getLevelByID(this.level);
        this._user.location = level.location;
    }

    public static isLastLocationLevelComplete() : boolean {
        const locationLevels: LevelModel[] = Levels.getLocationLevels(this._user.location);
        const lastLevel: LevelModel = locationLevels[locationLevels.length-1];
        const userLevel: UserLevelModel = this.getUserLevelByID(lastLevel.id);
        return userLevel?.isComplete === 1;
    }

    public static getLocationStars(): number {
        const locationLevels: LevelModel[] = Levels.getLocationLevels(this._user.location);
        let stars: number = 0;
        locationLevels.forEach( (locLevel: LevelModel) => {
            const uLevel: UserLevelModel = this.getUserLevelByID(locLevel.id);
            if ( uLevel ) {
                stars += uLevel.stars;
            }
        } );
        return stars;
    }

    public static getUserLevelByID( levelId: number ) : UserLevelModel {
        return this._user.levels ? this._user.levels.find( (level: UserLevelModel) => level.levelId === levelId ) : null;
    }

    public static getUpdatedLevels() : UserLevelModel[] {
        return this._user.levels ? this._user.levels.filter( (level: UserLevelModel) => level.newStars > 0 ) : null;
    }

    public static checkAddUserLevel( level: UserLevelModel ) : void {
        if ( !this.getUserLevelByID(level.levelId) ) {
            this._user.levels.push(level);
        }
    }

    public static setLevelNewStars( levelId: number, stars: number ) : void {
        const userLevel: UserLevelModel = this.getUserLevelByID(levelId);
        userLevel.newStars = !userLevel.stars || stars > userLevel.stars ? stars : userLevel.stars;
        userLevel.isComplete = 1;
    }

    public static get playedPictureNum() : number {
        return this._user.playedPictureNum;
    }

    public static get playedLevel() : PlayedLevelModel {
        return this._playedLevel;
    }

    public static get penaltySeconds() : number {
        return this._user.penaltySeconds;
    }

    private static setOpenLocationTimer(): void {
        if ( this._user.nextLocationTimer > 0 ) {

            const interval: any = setInterval(() => {
                this._user.nextLocationTimer -= 1000;
                if ( this._user.nextLocationTimer <= 0 ) {
                    this._user.nextLocationTimer = 0;
                    clearInterval(interval);
                }

                EventBus.publish(events.EVENT_ON_LOCATION_OPEN_TIMER_TICK, this._user.nextLocationTimer);

                if ( this._user.nextLocationTimer <= 0 ) {
                    EventBus.publish(events.EVENT_ON_LOCATION_OPEN_TIMER_END);
                }
            }, 1000);
        }
    }
}