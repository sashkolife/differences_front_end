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
    AddExtraTimeModel,
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

export class SceneLevel extends CContainer {

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
    private _particleUseHelpWheel: ParticleAnimation;
    private _particleUseHelpPath0: ParticleAnimation;
    private _particleUseHelpPath1: ParticleAnimation;

    private _pictureTouchSubscription:EventModel;
    private _nextLevelSubscription:EventModel;

    private _levelData:LevelModel;

    constructor( playedLevelData: PlayedLevelModel ) {

        super(Properties.get("sceneLevel"));

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this.updateSoundBtn();

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

        this.setInitialViews(playedLevelData);

        this._pictureTouchSubscription = EventBus.subscribe(events.EVENT_ON_FOUND_ON_TOUCH, this.onPictureTouch.bind(this));
        this._nextLevelSubscription = EventBus.subscribe(events.EVENT_ON_NEXT_LEVEL, this.onNextLevel.bind(this));
    }

    private setInitialViews( playedLevelData: PlayedLevelModel ) : void {

        this.setLevelDataViews( playedLevelData.level, playedLevelData.starsTime );
        this._picturesProgressBar.setCurrent(User.playedPictureNum);
        this._btnBoosterAddExtraTime.setPrice(User.configExtraTimePrice);
        this.updateBoosterHelpButton();

        this._levelPicturesContainer.init( playedLevelData.picture, playedLevelData.foundDifferences, playedLevelData.helpDifferences );
        playedLevelData.foundDifferences?.forEach( (diffId:number) => {
            this._differencesProgressBar.setFound( diffId );
        } );

        if ( User.penaltySeconds > 0 ) {
            WindowsController.instance().show(LevelPenaltyWindow, User.user);
        }
    }

    private setLevelDataViews( levelModel: LevelModel, starsTime: number ) : void {

        this._levelData = levelModel;
        this._levelText.text = Localization.get(this._levelText.textKey) + " " + this._levelData.id;

        this._differencesProgressBar.setCount(this._levelData.differencesCount);
        this._picturesProgressBar.setCount(this._levelData.picturesCount);
        this._levelStarsProgressBar.setTimers([this._levelData.time1stars, this._levelData.time2stars, this._levelData.time3stars], starsTime);

    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        super.destroy(_options);
        this._pictureTouchSubscription.unsubscribe();
        this._pictureTouchSubscription = null;
        this._nextLevelSubscription.unsubscribe();
        this._nextLevelSubscription = null;
    }

    init() : void {
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
                case "balanceBar":
                    this._balanceBar = new BalanceBar(props);
                    return this._balanceBar;
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
        Api.request(urls.URL_LEVEL_LEAVE).then(async ( loader: Response ) => {
            const obj: any = await loader.json();
            const data: UserModel = obj as UserModel;

            User.update(data);
        });
        EventBus.publish( events.EVENT_ON_LEVEL_LEAVE );
    }

    private onPictureTouch( data:PictureTouchEvent ): void {
        ScreenBlock.show();
        Api.request(urls.URL_LEVEL_FIND+"x="+Math.ceil(data.touchPos.x)+"&y="+Math.ceil(data.touchPos.y)).then( async (loader: Response ) => {

            const obj: any = await loader.json();

            if ( !obj ) {
                ScreenBlock.hide();
                return;
            }

            const findData:LevelFindDiffModel = obj as LevelFindDiffModel;

            if ( findData.user && Object.keys(findData.user).length > 0 ) {
                User.update(findData.user);
            }

            if ( findData.error ) {
                if ( findData.error == Errors.DIFFERENCE_IS_OUT ) {
                    if ( findData.user.penaltySeconds && findData.user.penaltySeconds > 0 ) {
                        WindowsController.instance().show(LevelPenaltyWindow, findData.user);
                    }
                }
                ScreenBlock.hide();
                return;
            }

            this._differencesProgressBar.setFound(findData.diffId);

            if ( findData.picture ) {
                Resource.loadPicture(findData.picture, (p: number) => {}).then(() => {
                    this._picturesProgressBar.setCurrent(findData.user.playedPictureNum);
                    this._differencesProgressBar.reset();
                    this._levelPicturesContainer.setNewPicture( findData.picture );
                    ScreenBlock.hide();
                });
            } else {
                ScreenBlock.hide();
                if ( findData.levelFinish ) {
                    this._levelStarsProgressBar.stopTimer();
                    User.updateWinLevel( this._levelData.id, findData.levelFinish.stars );

                    WindowsController.instance().show(LevelFinishWindow, {"levelData": this._levelData, "levelFinish": findData.levelFinish});
                }
            }

        });
    }

    private onNextLevel( levelData: LevelModel) : void {
        ScreenBlock.show();

        this.setLevelDataViews(levelData, levelData.time1stars);
        this._picturesProgressBar.setCurrent(1);

        Api.request(urls.URL_LEVEL_START+levelData.id).then( async ( loader: Response ) => {
            const data:StartModel = await loader.json();

            User.update(data.user);
            User.checkAddUserLevel({levelId:levelData.id, stars: 0});

            Resource.loadPicture(data.playedLevel.picture, (p: number) => {}).then(() => {
                this._differencesProgressBar.reset();
                this._levelPicturesContainer.setNewPicture( data.playedLevel.picture );
                ScreenBlock.hide();
            });
        } );
    }

    private onUseHelpClick() : void {
        if ( User.helps <= 0 && User.balance < this._btnBoosterUseHelp.getPrice() ) {
            WindowsController.instance().show(ShopWindow);
            return;
        }

        ScreenBlock.show();
        Api.request(urls.URL_LEVEL_HELP).then( async (loader: Response ) => {

            const helpDiff: HelpDiffModel = await loader.json();

            if ( !helpDiff ) {
                return;
            }

            if ( helpDiff.error ) {
                return;
            }

            ScreenBlock.hide();

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

            this._levelStarsProgressBar.addStarsTimer( addExtraTimeData.addExtraTime );
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
    }

}
