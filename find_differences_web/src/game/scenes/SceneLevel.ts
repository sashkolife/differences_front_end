import * as PIXI from 'pixi.js';
import CContainer from "../../components/CContainer";
import Properties from "../../data/Properties";
import BalanceBar from "../components/BalanceBar";
import CButton from "../../components/CButton";
import Sounds from "../../data/Sounds";
import * as constants from "../../constants/constants";
import PicturesProgressBar from "../components/PicturesProgressBar";
import DifferencesProgressBar from "../components/DifferencesProgressBar";
import CBMText from "../../components/CBMText";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import {Errors, LevelFindDiffModel, PlayedLevelModel, UserModel} from "../../models/ApiModels";
import LevelPicturesContainer from "../components/LevelPicturesContainer";
import ScreenBlock from "../components/ScreenBlock";
import {URL_LEVEL_FIND, URL_LEVEL_LEAVE} from "../../constants/urls";
import Resource from "../../data/Resource";
import Api from "../../utils/Api";
import User from "../../data/User";

export class SceneLevel extends CContainer {

    private _levelPicturesContainer : LevelPicturesContainer;
    private _picturesProgressBar : PicturesProgressBar;
    private _differencesProgressBar : DifferencesProgressBar;
    private _balanceBar : BalanceBar;
    private _soundOnBtn : CButton;
    private _soundOffBtn : CButton;
    private _levelText : CBMText;
    private _leaveBtn : CButton;

    private _levelId:number;

    private _pictureTouchSubscription:any;

    constructor(private _levelData: PlayedLevelModel ) {

        super(Properties.get("sceneLevel"));

        this._levelId = _levelData.level.id;

        this._soundOnBtn = this.getComponentByName("soundOnBtn");
        this._soundOffBtn = this.getComponentByName("soundOffBtn");

        this._soundOnBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this._soundOffBtn.setActionUp( this.onSoundSwitch.bind(this) );
        this.updateSoundBtn();

        this._levelText = this.getComponentByName("levelText");

        this._leaveBtn = this.getComponentByName("leaveBtn");
        this._leaveBtn.setActionUp( this.onLeaveTouch.bind(this) );

        this.setInitialViews();

        this._pictureTouchSubscription = EventBus.subscribe(events.EVENT_ON_PICTURE_TOUCH, this.onPictureTouch.bind(this));
    }

    setInitialViews() : void {

        this._levelText.text += " "+ this._levelId;

        this._differencesProgressBar.setCount(this._levelData.level.differencesCount);
        this._picturesProgressBar.setCurrent(User.playedPictureNum);
        this._picturesProgressBar.setCount(this._levelData.level.picturesCount);

        this._levelPicturesContainer.init( this._levelData.picture, this._levelData.foundDifferences );
        this._levelData.foundDifferences?.forEach( (diffId:number) => {
            this._differencesProgressBar.setFound( diffId );
        } );
    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        super.destroy(_options);
        this._pictureTouchSubscription.unsubscribe();
        this._pictureTouchSubscription = null;
    }

    init() : void {
    }

    getNewComponentByName( props: any ): any {

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
            }
        }

        return null;
    }

    updateSoundBtn() : void {
        this._soundOnBtn.visible = Sounds.isAudioAllowed();
        this._soundOffBtn.visible = !Sounds.isAudioAllowed();
    }

    onSoundSwitch(btn:any) : void {
        Sounds.setAllowAudio(!Sounds.isAudioAllowed());
        this.updateSoundBtn();
    }

    private onLeaveTouch(): void {
        Api.request(URL_LEVEL_LEAVE).then(async ( loader: Response ) => {
            const obj: any = await loader.json();
            const data: UserModel = obj as UserModel;

            User.update(data);
        });
        EventBus.publish( events.EVENT_ON_LEVEL_LEAVE );
    }

    private onPictureTouch( data:any ): void {
        ScreenBlock.show();
        Api.request(URL_LEVEL_FIND+"x="+Math.ceil(data.touchPos.x)+"&y="+Math.ceil(data.touchPos.y)).then( async (loader: Response ) => {

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
                if ( findData.isWin === true ) {
                    window.setTimeout( () => {
                        EventBus.publish( events.EVENT_ON_LEVEL_LEAVE );
                    }, 2000 );
                }
            }

        });
    }
}
