import * as PIXI from 'pixi.js';
import gsap from "gsap";
import CContainer from "../../components/CContainer";
import Properties from "../../data/Properties";
import BalanceBar from "../components/common/BalanceBar";
import CButton from "../../components/CButton";
import Sounds from "../../data/Sounds";
import * as constants from "../../constants/constants";
import PicturesProgressBar from "../components/level/PicturesProgressBar";
import DifferencesProgressBar from "../components/level/DifferencesProgressBar";
import CBMText from "../../components/CBMText";
import EventBus, {EventModel} from "../../utils/EventBus";
import * as events from "../../constants/events";
import {
    AddExtraTimeModel, CampaignModel,
    HelpDiffModel,
    LevelFindDiffModel,
    LevelModel,
    PlayedLevelModel,
    StartModel,
    UserModel
} from "../../models/ApiModels";
import LevelPicturesContainer from "../components/level/LevelPicturesContainer";
import ScreenBlock from "../components/common/ScreenBlock";
import * as urls from "../../constants/urls";
import Resource from "../../data/Resource";
import Api from "../../utils/Api";
import User from "../../data/User";
import WindowsController from "../windows/WindowsController";
import LevelFinishWindow from "../windows/LevelFinishWindow";
import Localization from "../../data/Localization";
import LevelPenaltyWindow from "../windows/LevelPenaltyWindow";
import {Errors} from "../../models/Enums";
import LevelStarsProgressBar from "../components/level/LevelStarsProgressBar";
import ButtonPay from "../components/common/ButtonPay";
import ShopWindow from "../windows/ShopWindow";
import CSprite from "../../components/CSprite";
import {PictureTouchEvent} from "../../models/EventModels";
import {ParticleAnimation} from "../../animations/ParticleAnimation";
import CBase from "../../components/CBase";
import Campaigns from "../../data/Campaigns";
import * as levelUtils from "../../utils/LevelsUtils";
import {URL_LEVEL_START} from "../../constants/urls";
import {debug} from "../../App";
import {ComponentModel} from "../../models/PropertiesModels";
import TrophyReceivedWindow from "../windows/TrophyReceivedWindow";
import {SceneBase} from "./SceneBase";
import {Point} from "pixi.js";
import Spinner from "../components/common/Spinner";

export class SceneLevel extends SceneBase {

    private _levelPicturesContainer: LevelPicturesContainer;
    private _picturesProgressBar: PicturesProgressBar;
    private _differencesProgressBar: DifferencesProgressBar;
    private _balanceBar: BalanceBar;
    private _levelStarsProgressBar: LevelStarsProgressBar;
    private _soundOnBtn: CButton;
    private _soundOffBtn: CButton;
    private _levelText: CBMText;
    private _leaveBtn: CButton;
    private _btnBoosterAddExtraTime: ButtonPay;
    private _btnBoosterUseHelp: ButtonPay;
    private _useHelpLight: CSprite;
    private _particleUseHelpWheel: ParticleAnimation;
    private _particleUseHelpPath0: ParticleAnimation;
    private _particleUseHelpPath1: ParticleAnimation;
    private _addExtraLight: CSprite;
    private _particleAddExtraTime: ParticleAnimation;
    private _particleAddExtraPath: ParticleAnimation;

    private _pictureTouchSubscription:EventModel;

    private _levelData:LevelModel;

    private _requestQueue: RequestData[] = [];
    private _currentRequest: RequestData;

    constructor() {

        super(Properties.get("sceneLevel"));

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this.updateSoundBtn();

        this._balanceBar = this.getComponentByName("balanceBar");

        this._levelText = this.getComponentByName("levelText");

        this._leaveBtn = this.getComponentByName("leaveBtn");
        this._leaveBtn.setActionUp( this.onLeaveTouch.bind(this) );

        this._btnBoosterAddExtraTime = this.getComponentByName("btnBoosterAddExtraTime");
        this._btnBoosterUseHelp = this.getComponentByName("btnBoosterUseHelp");
        this._btnBoosterAddExtraTime.setActionUp(this.onAddExtraTimeClick.bind(this));
        this._btnBoosterUseHelp.setActionUp(this.onUseHelpClick.bind(this));

        this._particleUseHelpWheel = this.getComponentByName("particleUseHelpWheel");
        this._particleUseHelpPath0 = this.getComponentByName("particleUseHelpPath0");
        this._particleUseHelpPath1 = this.getComponentByName("particleUseHelpPath1");
        this._useHelpLight = this.getComponentByName("useHelpLight");

        this._particleAddExtraPath = this.getComponentByName("particleAddExtraPath");
        this._particleAddExtraTime = this.getComponentByName("particleAddExtraTime");
        this._addExtraLight = this.getComponentByName("addExtraLight");

        this._pictureTouchSubscription = EventBus.subscribe(events.EVENT_ON_FOUND_ON_TOUCH, this.onPictureTouch.bind(this));
    }

    public startLevel(levelData: LevelModel): void {

        this._levelData = levelData;

        let startLeveUrl: string = URL_LEVEL_START+levelData.id;
        if (levelData.campaignId > 0) {
            startLeveUrl += "&campaignId="+levelData.campaignId;
        }

        const urlParams = new URLSearchParams( window.location.search);
        const startPictureId: number = parseInt(urlParams.get("startPictureId"));
        if ( debug && startPictureId ) {
            startLeveUrl = "&startPictureId="+startPictureId
        }

        if ( User.penaltySeconds > 0 ) {
            WindowsController.instance().show(LevelPenaltyWindow, User.user);
        }

        ScreenBlock.show();

        Api.request(startLeveUrl).then( async ( loader: Response ) => {

            const obj: any = await loader.json();
            const data:StartModel = obj as StartModel;

            User.update(data.user);

            this.setInitialViews(data.playedLevel);

        } ).catch(()=>{
            ScreenBlock.hide();
            EventBus.publish( events.EVENT_ON_NETWORK_ERROR );
        });
    }

    private setInitialViews( playedLevelData: PlayedLevelModel ) : void {
        this._levelText.text = Localization.get(this._levelText.textKey) + " " + this._levelData.id;

        this._differencesProgressBar.setCount(this._levelData.differencesCount);
        this._levelStarsProgressBar.setTimers([this._levelData.time1stars, this._levelData.time2stars, this._levelData.time3stars], playedLevelData.starsTime);
        this._picturesProgressBar.setCount(this._levelData.picturesCount, User.playedPictureNum);
        this._btnBoosterAddExtraTime.setPrice(User.configExtraTimePrice);

        this.updateBoosterHelpButton();

        Resource.loadPicture(playedLevelData.picture, (p:number) => {}).then( () => {
            this._levelPicturesContainer.init( playedLevelData.picture, playedLevelData.foundDifferences, playedLevelData.helpDifferences );
            playedLevelData.foundDifferences?.forEach( (diffId:number) => {
                this._differencesProgressBar.setFound( diffId );
            } );

            ScreenBlock.hide();
        } ).catch(()=>{
            ScreenBlock.hide();
            EventBus.publish( events.EVENT_ON_NETWORK_ERROR );
        });
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        super.destroy(_options);
        this._pictureTouchSubscription.unsubscribe();
        this._pictureTouchSubscription = null;
    }

    public getNewComponentByType( props: any ) : any {
        if (props.type == constants.COMPONENT_BALANCE_BAR) {
            return new BalanceBar(props);
        }
        return super.getNewComponentByType(props);
    }

    public getNewComponentByName( props: any ): any {

        const name: string = props[constants.KEY_NAME];

        if ( name ) {
            switch ( name ) {
                case "levelPicturesContainer":
                    this._levelPicturesContainer = new LevelPicturesContainer(props);
                    return this._levelPicturesContainer;
                case "picturesProgressBar":
                    this._picturesProgressBar = new PicturesProgressBar(props);
                    return this._picturesProgressBar;
                case "differencesProgressBar":
                    this._differencesProgressBar = new DifferencesProgressBar(props);
                    return this._differencesProgressBar;
                case "levelStarsProgressBar":
                    this._levelStarsProgressBar = new LevelStarsProgressBar(props);
                    return this._levelStarsProgressBar;
            }
        }

        return null;
    }

    private updateSoundBtn() : void {
        this._soundOnBtn.visible = Sounds.isAudioAllowed();
        this._soundOffBtn.visible = !Sounds.isAudioAllowed();
    }

    private onSoundSwitch(btn:any) : void {
        Sounds.setAllowAudio(!Sounds.isAudioAllowed());
        this.updateSoundBtn();
    }

    private onLeaveTouch(): void {
        if (this._currentRequest || this._requestQueue.length > 0) {
            return;
        }

        Api.request(urls.URL_LEVEL_LEAVE).then(async ( loader: Response ) => {
            const obj: any = await loader.json();
            const data: UserModel = obj as UserModel;

            User.update(data);
        });
        EventBus.publish(events.EVENT_ON_LEVEL_LEAVE);
    }

    private onPictureTouch( data:PictureTouchEvent ): void {
        this.addRequest(urls.URL_LEVEL_FIND, data.touchPos, data.screenPos, new Spinner(this, data.screenPos));
        this.doNextRequest();
    }

    private onUseHelpClick() : void {
        if ( User.helps <= 0 && User.balance < this._btnBoosterUseHelp.getPrice() ) {
            WindowsController.instance().show(ShopWindow);
            return;
        }

        ScreenBlock.show();
        Api.request(urls.URL_LEVEL_HELP).then( async (loader: Response ) => {
            ScreenBlock.hide();

            const helpDiff: HelpDiffModel = await loader.json();

            if ( !helpDiff ) {
                return;
            }

            if ( helpDiff.error ) {
                return;
            }

            if ( helpDiff.user ) {
                User.update(helpDiff.user);
                EventBus.publish(events.EVENT_ON_BALANCE_UPDATE, {coins:helpDiff.user.coins});
                this.updateBoosterHelpButton();
            }

            if ( helpDiff.diffId ) {
                this.playHelpParticle(helpDiff.diffId, () => {
                    this._levelPicturesContainer.showHelp(helpDiff.diffId, true);
                });
            }
        }).catch(()=>{
            ScreenBlock.hide();
            EventBus.publish( events.EVENT_ON_NETWORK_ERROR );
        });
    }

    private onAddExtraTimeClick() : void {
        if ( User.balance < User.configExtraTimePrice ) {
            WindowsController.instance().show(ShopWindow);
            return;
        }

        ScreenBlock.show();
        Api.request(urls.URL_LEVEL_ADD_EXTRA_TIME).then( async (loader: Response ) => {

            const addExtraTimeData: AddExtraTimeModel = await loader.json();

            if ( !addExtraTimeData || addExtraTimeData.error ) {
                return;
            }

            ScreenBlock.hide();

            if ( addExtraTimeData.user ) {
                User.update(addExtraTimeData.user);
                EventBus.publish(events.EVENT_ON_BALANCE_UPDATE, {coins:addExtraTimeData.user.coins});
            }
            this.playAddExtraParticle(()=>{
                this._levelStarsProgressBar.addStarsTimer( addExtraTimeData.addExtraTime );
            });

        }).catch(()=>{
            ScreenBlock.hide();
            EventBus.publish( events.EVENT_ON_NETWORK_ERROR );
        });
    }

    private updateBoosterHelpButton() : void {
        if ( User.helps > 0 ) {
            this._btnBoosterUseHelp.setPrice( User.helps );
            this._btnBoosterUseHelp.getPriceImage().visible = false;
            this._btnBoosterUseHelp.getPriceText().anchor.x = 0.5;
            this._btnBoosterUseHelp.getPriceText().x = 3;
        } else {
            this._btnBoosterUseHelp.getPriceImage().visible = true;
            this._btnBoosterUseHelp.setPrice( User.configHelpPrice );
            this._btnBoosterUseHelp.getPriceText().anchor.x = 0;
            this._btnBoosterUseHelp.getPriceText().x = 0;
        }
    }

    private playHelpParticle(diffId: number, complete: gsap.Callback): void {
        this._particleUseHelpWheel.playOnce();
        this._particleUseHelpPath0.reset();
        this._particleUseHelpPath1.reset();
        this._particleUseHelpPath0.setPlay(true);
        this._particleUseHelpPath1.setPlay(true);

        const duration: number = 0.32;
        const ease: string = "power1.out";

        const startPos0: PIXI.Point = new PIXI.Point(0,0);
        const endGPos0: PIXI.Point = this._levelPicturesContainer.getPicture1().getDiffCenter(diffId);
        const endLPos0: PIXI.Point = this._particleUseHelpPath0.toLocal(endGPos0);
        const anchors0 = [{x: startPos0.x, y: startPos0.y}, {x: endLPos0.x/2, y: -80}, {x: endLPos0.x, y: endLPos0.y}];
        gsap.to( startPos0, {
            duration: duration,
            ease: ease,
            motionPath: { path: anchors0 },
            onUpdate: () => {
                this._particleUseHelpPath0.updateSpawnPos(startPos0.x, startPos0.y);
            }
        });

        const startPos1: PIXI.Point = new PIXI.Point(0,0);
        const endGPos1: PIXI.Point = this._levelPicturesContainer.getPicture0().getDiffCenter(diffId);
        const endLPos1: PIXI.Point = this._particleUseHelpPath1.toLocal(endGPos1);
        const anchors1 = [{x: startPos1.x, y: startPos1.y}, {x: endLPos1.x/2, y: endLPos1.y}, {x: endLPos1.x, y: endLPos1.y}];
        gsap.to( startPos1, {
            duration: duration,
            ease: ease,
            motionPath: { path: anchors1 },
            onUpdate: () => {
                this._particleUseHelpPath1.updateSpawnPos(startPos1.x, startPos1.y);
            },
            onComplete: complete
        });

        this._useHelpLight.visible = true;
        this._useHelpLight.alpha = 0;
        gsap.to(this._useHelpLight, {duration: 0.3, alpha: 1}).then(()=>{
            gsap.to(this._useHelpLight, {duration: 0.3, alpha: 0});
        });
    }

    private playAddExtraParticle(complete: gsap.Callback): void {
        this._particleAddExtraTime.playOnce();
        this._particleAddExtraPath.reset();
        this._particleAddExtraPath.setPlay(true);

        const duration: number = 0.32;
        const ease: string = "power1.out";

        const startPos: PIXI.Point = new PIXI.Point(0,0);
        const endGPos: PIXI.Point = this._levelStarsProgressBar.toGlobal(new PIXI.Point(100));
        const endLPos: PIXI.Point = this._particleAddExtraPath.toLocal(endGPos);
        const anchors = [{x: startPos.x, y: startPos.y}, {x: endLPos.x/2, y: -120}, {x: endLPos.x, y: endLPos.y}];
        gsap.to( startPos, {
            duration: duration,
            ease: ease,
            motionPath: { path: anchors },
            onUpdate: () => {
                this._particleAddExtraPath.updateSpawnPos(startPos.x, startPos.y);
            },
            onComplete: complete
        });

        this._addExtraLight.visible = true;
        this._addExtraLight.alpha = 0;
        gsap.to(this._addExtraLight, {duration: 0.3, alpha: 1}).then(()=>{
            gsap.to(this._addExtraLight, {duration: 0.3, alpha: 0});
        });
    }

    private clearAllRequests(): void {
        this._requestQueue.forEach(reqData => {
            reqData.spinner?.remove();
        });
        this._requestQueue.length = 0;
        this._currentRequest = null;
    }

    private addRequest(url: string, pos: PIXI.Point, screenPos: PIXI.Point, spinner?: Spinner): void {
        this._requestQueue.push({url: url, pos: pos, screenPos: screenPos, spinner: spinner});
    }

    private doNextRequest(): void {
        if (!this._currentRequest) {
            this._currentRequest = this._requestQueue.shift();
            if (this._currentRequest) {
                switch (this._currentRequest.url) {
                    case urls.URL_LEVEL_FIND:
                        this.doFindRequest();
                        break;
                    default:
                        this.doNextRequest();
                }
            }
        }
    }

    private doFindRequest(): void {
        Api.request(this._currentRequest.url + "x=" + Math.ceil(this._currentRequest.pos.x) + "&y=" + Math.ceil(this._currentRequest.pos.y)).then(async (loader: Response) => {

            this._currentRequest.spinner?.remove();

            const obj: any = await loader.json();
            if (!obj) {
                this.clearAllRequests();
                EventBus.publish(events.EVENT_ON_NETWORK_ERROR);
                return;
            }

            const findData: LevelFindDiffModel = obj as LevelFindDiffModel;

            if (findData.user && Object.keys(findData.user).length > 0) {
                User.update(findData.user);
            }

            if (findData.error) {
                if (findData.error == Errors.DIFFERENCE_IS_OUT) {
                    this._levelPicturesContainer.findDiff(-1, this._currentRequest.screenPos);

                    if (findData.user.penaltySeconds && findData.user.penaltySeconds > 0) {
                        this.clearAllRequests();
                        WindowsController.instance().show(LevelPenaltyWindow, findData.user);
                        return;
                    }

                }

                this._currentRequest = null;
                this.doNextRequest();

                return;
            }

            this._levelPicturesContainer.findDiff(findData.diffId, this._currentRequest.screenPos);

            this._differencesProgressBar.setFound(findData.diffId, () => {
                if (findData.picture) {
                    Resource.loadPicture(findData.picture, (p: number) => {
                    }).then(() => {
                        ScreenBlock.hide();
                        this._picturesProgressBar.setCurrent(findData.user.playedPictureNum);
                        this._differencesProgressBar.reset();
                        ScreenBlock.show();
                        this._levelPicturesContainer.setNewPicture(findData.picture, () => {
                            ScreenBlock.hide();
                        });
                    }).catch(() => {
                        ScreenBlock.hide();
                        EventBus.publish(events.EVENT_ON_NETWORK_ERROR);
                    });
                } else if (findData.levelFinish) {
                    ScreenBlock.hide();

                    this._levelStarsProgressBar.stopTimer();
                    let nextLevelData: LevelModel = null;
                    let isCampaignTrophy: boolean = false;
                    if (findData.campaign) {
                        const campaign: CampaignModel = Campaigns.getCampaignById(findData.campaign.id);

                        if (findData.campaign.isComplete)
                            campaign.isComplete = findData.campaign.isComplete;

                        if (findData.campaign.isTrophy) {
                            campaign.isTrophy = findData.campaign.isTrophy;
                            isCampaignTrophy = true;
                        }

                        if (findData.campaign.level)
                            campaign.level = findData.campaign.level;

                        levelUtils.updateWinLevel(campaign.levels, this._levelData.id, findData.levelFinish.stars);
                        nextLevelData = levelUtils.getNextLevel(campaign.levels, this._levelData);
                    } else {
                        levelUtils.updateWinLevel(User.levels, this._levelData.id, findData.levelFinish.stars);
                        nextLevelData = levelUtils.getNextLevel(User.levels, this._levelData);
                    }

                    if (findData.levelFinish.newCampaigns) {
                        Campaigns.initNewCampaigns(findData.levelFinish.newCampaigns);
                    }

                    WindowsController.instance().show(LevelFinishWindow, {
                        "levelData": this._levelData,
                        "levelFinish": findData.levelFinish,
                        "nextLevelData": nextLevelData,
                        "isCampaignTrophy": isCampaignTrophy
                    });
                } else {
                    ScreenBlock.hide();
                }
            });

            if (findData.picture || findData.levelFinish) {
                this.clearAllRequests();
                ScreenBlock.show(findData.picture ? 500 : 2000);
                return;
            }

            this._currentRequest = null;
            this.doNextRequest();

        }).catch(() => {
            ScreenBlock.hide();
            this.clearAllRequests();
            EventBus.publish(events.EVENT_ON_NETWORK_ERROR);
        });
    }
}


interface RequestData {
    url: string;
    pos: PIXI.Point;
    screenPos: PIXI.Point;
    spinner: Spinner;
}