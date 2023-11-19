import CContainer from "../../../components/CContainer";
import Resource from "../../../data/Resource";
import * as constants from "../../../constants/constants";
import CButton from "../../../components/CButton";
import EventBus from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import {CampaignModel} from "../../../models/ApiModels";

export default class CampaignButton extends CContainer {
    private _button: CButton;

    private _campaignData: CampaignModel;

    constructor( props: any ) {
        super( props );

        this._button = this.getComponentByName("button");

        this._button.setActionUp( this.onClick.bind(this) );
        this._button.setActionOver( this.onOver.bind(this) );
        this._button.setActionOut( this.onOut.bind(this) );

        //this.positionTest();
    }

    setCampaignData( data: CampaignModel ) : void {
        this._campaignData = data;
        if ( data.level >= 1 ) {
            this._button.setEnabled(true);
        }
    }

    getCampaignData(): CampaignModel {
        return this._campaignData;
    }
    //
    //
    // setNewStars() : void {
    //     if ( !this._userLevelData ) {
    //         return;
    //     }
    //     const newStars:number = this._userLevelData.newStars ? this._userLevelData.newStars : this._userLevelData.stars;
    //     if ( newStars > this._userLevelData.stars ) {
    //         this._starsWins = newStars;
    //         let counterI: number = 0;
    //         for (let i: number = this._userLevelData.stars; i < newStars; i++) {
    //             setTimeout((si: number)=>{
    //                 this._stars[si].visible = true;
    //                 this._particles[si].playOnce(null);
    //             }, 100*counterI, i);
    //             counterI++;
    //         }
    //     }
    //     this._userLevelData.stars = newStars;
    // }
    //
    // getLevelData() : LevelModel {
    //     return this._levelData;
    // }
    //
    // getUserLevelData() : UserLevelModel {
    //     return this._userLevelData;
    // }
    //
    // setAvailability( value: boolean ) : void {
    //     if ( value ) {
    //         this._availableMarker.setEnabled(true);
    //         this._availableMarker.setState(constants.KEY_NORMAL);
    //         this._numBg.texture = Resource.getTexture(this._numBg.properties.textureFull);
    //         this._ribbon.visible = true;
    //     }
    // }
    //
    // setStars( value: number ) : void {
    //     this._starsWins = value;
    //     for ( let i: number = 0; i < this._starsWins; i++ ) {
    //         this._stars[i].visible = true;
    //     }
    // }
    //
    // winStar( num: number ) : void {
    //     this._stars[num].visible = true;
    // }
    //
    // setActive( value: boolean ): void {
    //     this._isActive = value;
    // }
    //
    // getId(): number {
    //     return this.properties.id;
    // }
    //
    onClick() : void {
        EventBus.publish(events.EVENT_ON_MAP_CAMPAIGN_CLICK, this);
    }

    onOver() : void {
        EventBus.publish(events.EVENT_ON_MAP_CAMPAIGN_OVER, this);
    }

    onOut() : void {
        EventBus.publish(events.EVENT_ON_MAP_CAMPAIGN_OUT, this);
    }
    //
    // positionTest(): void {
    //     const self:any = this;
    //     self.interactive = true;
    //
    //     let isDrag:boolean = false;
    //
    //     self.onmousedown = ()=>{
    //         isDrag = true;
    //         self.parent.interactive = true;
    //         self.parent.parent.interactive = false;
    //
    //         self.parent.onmousemove = (e:any)=>{
    //             if (isDrag) {
    //                 this.position=self.parent.toLocal(e.global);
    //             }
    //         };
    //     };
    //
    //     self.onmouseup = () => {
    //         self.parent.onmousemove = null;
    //         // console.log(e);
    //         isDrag = false;
    //         self.parent.interactive = false;
    //         self.parent.parent.interactive = true;
    //     };
    //     self.onmouseupoutside = () => {
    //         // console.log(e);
    //         isDrag = false;
    //         self.parent.interactive = false;
    //         self.parent.parent.interactive = true;
    //     };
    // }

}
