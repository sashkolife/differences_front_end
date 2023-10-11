import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSprite from "../../../components/CSprite";
import Resource from "../../../data/Resource";
import * as constants from "../../../constants/constants";
import CButton from "../../../components/CButton";
import EventBus from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import {LevelModel, UserLevelModel} from "../../../models/ApiModels";

export default class MapLevel extends CContainer {
    private _availableMarker: CButton;
    private _numBg: CSprite;
    private _numLabel: CText;

    private _ribbon: CSprite;
    private _stars: Array<CSprite> = null;

    private _starsWins: number = 0;

    private _isActive: boolean = false;

    private _levelData: LevelModel;
    private _userLevelData: UserLevelModel;

    constructor( props: any ) {
        super( props );

        this._availableMarker = this.getComponentByName("availableMarker");
        this._numBg = this.getComponentByName("numBg");
        this._ribbon = this.getComponentByName("ribbon");
        this._numLabel = this.getComponentByName("numLabel");

        this._stars = [
            this.getComponentByName("star0"),
            this.getComponentByName("star1"),
            this.getComponentByName("star2")
        ];

        this._availableMarker.setActionUp( this.onLevelClick.bind(this) );
        this._availableMarker.setActionOver( this.onLevelOver.bind(this) );
        this._availableMarker.setActionOut( this.onLevelOut.bind(this) );

        //this.positionTest();
    }

    setLevelData( data: LevelModel ) : void {
        this._levelData = data;
    }

    setUserLevelData( data: UserLevelModel ) : void {
        this._userLevelData = data;
        if ( this._userLevelData ) {
            this.setStars(this._userLevelData.stars);
        }
    }

    setNewStars() : void {
        if ( !this._userLevelData ) {
            return;
        }
        const newStars:number = this._userLevelData.newStars ? this._userLevelData.newStars : this._userLevelData.stars;
        if ( newStars > this._userLevelData.stars ) {
            this.setStars(newStars);
        }
        this._userLevelData.stars = newStars;
    }

    getLevelData() : LevelModel {
        return this._levelData;
    }

    getUserLevelData() : UserLevelModel {
        return this._userLevelData;
    }

    setAvailability( value: boolean ) : void {
        if ( value ) {
            this._availableMarker.setEnabled(true);
            this._availableMarker.setState(constants.KEY_NORMAL);
            this._numBg.texture = Resource.getTexture(this._numBg.properties.textureFull);
            this._ribbon.visible = true;
        }
    }

    setStars( value: number ) : void {
        this._starsWins = value;
        for ( let i: number = 0; i < this._starsWins; i++ ) {
            this._stars[i].visible = true;
        }
    }

    winStar( num: number ) : void {
        this._stars[num].visible = true;
    }

    setActive( value: boolean ): void {
        this._isActive = value;
    }

    getId(): number {
        return this.properties.id;
    }

    onLevelClick() : void {
        EventBus.publish(events.EVENT_ON_MAP_LEVEL_CLICK, this);
    }

    onLevelOver() : void {
        EventBus.publish(events.EVENT_ON_MAP_LEVEL_OVER, this);
    }

    onLevelOut() : void {
        EventBus.publish(events.EVENT_ON_MAP_LEVEL_OUT, this);
    }

    positionTest(): void {
        const self:any = this;
        self.interactive = true;

        let isDrag:boolean = false;

        self.onmousedown = ()=>{
            isDrag = true;
            self.parent.interactive = true;
            self.parent.parent.interactive = false;

            self.parent.onmousemove = (e:any)=>{
                if (isDrag) {
                    this.position=self.parent.toLocal(e.global);
                }
            };
        };

        self.onmouseup = () => {
            self.parent.onmousemove = null;
            // console.log(e);
            isDrag = false;
            self.parent.interactive = false;
            self.parent.parent.interactive = true;
        };
        self.onmouseupoutside = () => {
            // console.log(e);
            isDrag = false;
            self.parent.interactive = false;
            self.parent.parent.interactive = true;
        };
    }

}
