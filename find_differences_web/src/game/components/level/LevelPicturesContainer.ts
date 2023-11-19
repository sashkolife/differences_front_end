import * as PIXI from 'pixi.js';
import gsap from "gsap";
import {FederatedPointerEvent, Point} from 'pixi.js';
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import {LevelPictureModel} from "../../../models/ApiModels";
import EventBus, {EventModel} from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import LevelPictureDifference from "./LevelPictureDifference";
import {ContainerModel} from "../../../models/PropertiesModels";
import {DifferencesColors} from "../../../models/Enums";
import LevelPicture from "./LevelPicture";
import * as constants from "../../../constants/constants";
import {PictureTouchEvent} from "../../../models/EventModels";
import {EVENT_ON_FOUND_ON_TOUCH} from "../../../constants/events";

export default class LevelPicturesContainer extends CContainer {

    private _picture0: LevelPicture;
    private _picture1: LevelPicture;
    private _picture0next: LevelPicture;
    private _picture1next: LevelPicture;

    private _missImage: CSprite;
    private _hitImage: CSprite;

    private _knownDiffsIds: Array<number> = [];
    private _onPictureTouch: EventModel;
    private _pictureData: LevelPictureModel;

    constructor( props: ContainerModel ) {
        super( props );
        this._picture0 = this.getComponentByName("picture0");
        this._picture1 = this.getComponentByName("picture1");
        this._picture0next = this.getComponentByName("picture0next");
        this._picture1next = this.getComponentByName("picture1next");

        this._missImage = this.getComponentByName("missImage");
        this._hitImage = this.getComponentByName("hitImage");

        this._onPictureTouch = EventBus.subscribe(events.EVENT_ON_PICTURE_TOUCH, this.onPictureTouchEnd.bind(this));

    }

    destroy(_options?: PIXI.IDestroyOptions | boolean) {
        super.destroy(_options);
        this._onPictureTouch.unsubscribe();
        this._onPictureTouch = null;
    }

    public getPictureId(): number {
        return this._pictureData.id;
    }

    public getNewComponentByType( props: any ) : any {
        let component: any = super.getNewComponentByType(props);
        if ( !component && props.type == constants.COMPONENT_LEVEL_PICTURE ) {
            component = new LevelPicture(props);
        }
        return component;
    }

    init( data:LevelPictureModel, foundDifferences?:number[], helpDifferences?:number[] ) : void {
        this.initPictures(this._picture0, this._picture1, data, null);

        this._knownDiffsIds.length = 0;

        if ( foundDifferences && foundDifferences.length > 0 ) {
            this._knownDiffsIds = foundDifferences;
            for ( let i : number = 0; i < foundDifferences.length; i++ ) {
                this.showDiff(foundDifferences[i]);
            }
        }

        if ( helpDifferences && helpDifferences.length > 0 ) {
            for ( let i : number = 0; i < helpDifferences.length; i++ ) {
                this.showHelp(helpDifferences[i]);
            }
        }
    }

    private onPictureTouchEnd( data: PictureTouchEvent ) : void {
        if (this._knownDiffsIds.indexOf(data.foundIndex) !== -1) {
            return;
        }

        if ( data.foundIndex >= 0 ) {
            this._knownDiffsIds.push(data.foundIndex);
            this.showDiff(data.foundIndex, true);
        }

        this.playTouch(data.screenPos, data.foundIndex);

        EventBus.publish(events.EVENT_ON_FOUND_ON_TOUCH, data);
    }

    public setNewPicture( data:LevelPictureModel, callback?:Function ) : void {
        this._knownDiffsIds.length = 0;

        this._picture0.moveToOut();
        this._picture1.moveToOut( () => {
            const p0:LevelPicture = this._picture0;
            const p1:LevelPicture = this._picture1;
            this._picture0 = this._picture0next;
            this._picture1 = this._picture1next;
            this._picture0next = p0;
            this._picture1next = p1;
        } );

        this.initPictures(this._picture0next, this._picture1next, data, callback);
    }

    private showDiff( diffId: number, animate: boolean = false ) : void {
        this._picture0.showDiff(diffId, animate);
        this._picture1.showDiff(diffId, animate);
    }

    public showHelp(diffId: number, animate: boolean = false ) : void {
        this._picture0.showHelp(diffId, animate);
        this._picture1.showHelp(diffId, animate);
    }

    public getPicture0(): LevelPicture {
        return this._picture0;
    }

    public getPicture1(): LevelPicture {
        return this._picture1;
    }

    private playTouch( pos: Point, diffId: number ) : void {
        const touchViewObj:CSprite = diffId < 0 ? this._missImage : this._hitImage;
        touchViewObj.position = this.toLocal(pos);
        touchViewObj.visible = true;
        touchViewObj.alpha = 1;
        gsap.killTweensOf(touchViewObj);
        gsap.to(touchViewObj, {duration: 0.3, alpha:0, onComplete: (obj:CSprite) => {
                obj.visible = false;
            }, onCompleteParams: [touchViewObj]
        });

        if ( diffId < 0 ) {
            this.shakeContainer();
        }
    }

    private shakeContainer(): void {
        const currentX: number = this.properties.x;
        const currentY: number = this.properties.y;
        const tl = gsap.timeline();
        tl.to(this, {duration: 0.02, x: Math.random() < 0.5 ? "-=5" : "+=5", y: "+=5"});
        tl.to(this, {duration: 0.02, x: currentX, y: currentY});
    }

    private initPictures( pic0: LevelPicture, pic1: LevelPicture, data: LevelPictureModel, callback: Function ): void {
        console.log("initPictures id =", data.id, "complexity =", data.c);
        this._pictureData = data;
        pic0.setPicture(data.pictKey1);
        pic1.setPicture(data.pictKey2);
        pic0.performPolygons(data.pictKeyJson);
        pic1.performPolygons(data.pictKeyJson);
        pic0.moveToPosition();
        pic1.moveToPosition(callback);
    }
}
