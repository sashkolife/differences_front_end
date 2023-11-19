import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSprite from "../../../components/CSprite";
import Resource from "../../../data/Resource";
import * as constants from "../../../constants/constants";
import CButton from "../../../components/CButton";
import EventBus from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import {LevelModel} from "../../../models/ApiModels";
import {ParticleAnimation} from "../../../animations/ParticleAnimation";

export default class MapLevel extends CContainer {
    private _availableMarker: CButton;
    private _numBg: CSprite;
    private _numLabel: CText;

    private _ribbon: CSprite;
    private _particles: ParticleAnimation[];
    private _stars: Array<CSprite> = null;

    private _starsWins: number = 0;

    private _isActive: boolean = false;

    private _levelData: LevelModel;

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
        this._particles = [
            this.getComponentByName("particle0"),
            this.getComponentByName("particle1"),
            this.getComponentByName("particle2")
        ];

        this._availableMarker.setActionUp( this.onLevelClick.bind(this) );
        this._availableMarker.setActionOver( this.onLevelOver.bind(this) );
        this._availableMarker.setActionOut( this.onLevelOut.bind(this) );

        //this.positionTest();
    }

    setLevelData( data: LevelModel ) : void {
        this._levelData = data;

        if ( this._levelData?.stars > 0 ) {
            this.setStars(this._levelData.stars);
        }
    }

    setNewStars() : void {
        const newStars:number = this._levelData.newStars ? this._levelData.newStars : this._levelData.stars;
        const stars:number = this._levelData.stars||0;
        if ( newStars > stars ) {
            this._starsWins = newStars;
            let counterI: number = 0;
            for (let i: number = stars; i < newStars; i++) {
                setTimeout((si: number)=>{
                    this._stars[si].visible = true;
                    this._particles[si].playOnce(null);
                }, 100*counterI, i);
                counterI++;
            }
        }
    }

    getLevelData() : LevelModel {
        return this._levelData;
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
            console.log(this.position);
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
