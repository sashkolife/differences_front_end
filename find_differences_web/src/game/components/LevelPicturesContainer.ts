import * as PIXI from 'pixi.js';
import CSprite from "../../components/CSprite";
import CContainer from "../../components/CContainer";
import {LevelPictureModel} from "../../models/ApiModels";
import {FederatedPointerEvent, Point} from "pixi.js";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";
import LevelPictureDifference from "./LevelPictureDifference";
import {ContainerModel} from "../../models/PropertiesModels";

export default class LevelPicturesContainer extends CContainer {

    private _picture1h: CSprite;
    private _picture2h: CSprite;
    private _picture1v: CSprite;
    private _picture2v: CSprite;

    private _picture1: CSprite;
    private _picture2: CSprite;

    private _levelPicturesData: LevelPictureModel;
    private _differences: Array<LevelPictureDifference> = [];
    private _knownDiffsIds:Array<number> = [];
    private _onPictureTouch:Function = null;

    constructor( props: ContainerModel ) {
        super( props );
        this._picture1h = this.getComponentByName("picture1h");
        this._picture2h = this.getComponentByName("picture2h");
        this._picture1v = this.getComponentByName("picture1v");
        this._picture2v = this.getComponentByName("picture2v");

        this._onPictureTouch = this.onPictureTouchEnd.bind(this);
    }

    init( data:LevelPictureModel, foundDifferences?:number[] ) : void {

        this._levelPicturesData = data;

        const p1Texture:PIXI.Texture = PIXI.Texture.from(data.pictKey1);
        const p2Texture:PIXI.Texture = PIXI.Texture.from(data.pictKey2);
        let pScale:number = 1;

        if ( p1Texture.width > p1Texture.height ) {
            this._picture1 = this._picture1h;
            this._picture2 = this._picture2h;
            pScale = (this._picture1.height/p1Texture.height);
            this._picture1.width = p1Texture.width*pScale;
            this._picture2.width = p2Texture.width*pScale;
        } else {
            this._picture1 = this._picture1v;
            this._picture2 = this._picture2v;
            pScale = (this._picture1.width/p1Texture.width);
            this._picture1.height = p1Texture.height*pScale;
            this._picture2.height = p2Texture.height*pScale;
        }

        this._picture1.x = this._picture1.properties.x - (this._picture1.width>>1);
        this._picture1.y = this._picture1.properties.y - (this._picture1.height>>1);

        this._picture2.x = this._picture2.properties.x - (this._picture2.width>>1);
        this._picture2.y = this._picture2.properties.y - (this._picture2.height>>1);

        this._picture1.removeChildren();
        this._picture2.removeChildren();

        this._picture1.texture = p1Texture;
        this._picture2.texture = p2Texture;

        (this._picture1 as any).interactive = true;
        (this._picture2 as any).interactive = true;

        (this._picture1h as any).off("mouseup", this._onPictureTouch);
        (this._picture2h as any).off("mouseup", this._onPictureTouch);
        (this._picture1v as any).off("mouseup", this._onPictureTouch);
        (this._picture2v as any).off("mouseup", this._onPictureTouch);
        (this._picture1h as any).off("touchend", this._onPictureTouch);
        (this._picture2h as any).off("touchend", this._onPictureTouch);
        (this._picture1v as any).off("touchend", this._onPictureTouch);
        (this._picture2v as any).off("touchend", this._onPictureTouch);

        (this._picture1 as any).on("mouseup", this._onPictureTouch);
        (this._picture1 as any).on("touchend", this._onPictureTouch);
        (this._picture2 as any).on("mouseup", this._onPictureTouch);
        (this._picture2 as any).on("touchend", this._onPictureTouch);

        this.performPolygons();

        if ( foundDifferences && foundDifferences.length > 0 ) {
            this._knownDiffsIds = foundDifferences;
            for ( let i : number = 0; i < foundDifferences.length; i++ ) {
                this.drawDiff(this._differences[foundDifferences[i]]);
            }
        }
    }

    private performPolygons() : void {

        const jData: number[][][] = PIXI.Assets.cache.get(this._levelPicturesData.pictKeyJson);

        this._differences.length = 0;

        for ( let i : number = 0; i < jData.length; i++ ) {
            if ( jData[i].length == 2 ) {
                jData[i].push([jData[i][0][0], jData[i][1][1]]);
                jData[i].splice(1,0,[jData[i][1][0], jData[i][0][1]]);
            }
            this._differences.push( new LevelPictureDifference( i, jData[i] ) );
        }
    }

    private onPictureTouchEnd( e: FederatedPointerEvent ) : void {
        const touchPos:Point = e.getLocalPosition(e.currentTarget as any);

        let foundIndex:number = -1;
        for ( let i : number = 0; i < this._differences.length; i++ ) {
            if ( this._differences[i].contains( touchPos.x, touchPos.y ) && this._knownDiffsIds.indexOf(i) === -1 ) {
                foundIndex = i;
                this._knownDiffsIds.push(foundIndex);
                this.drawDiff(this._differences[i]);
                break;
            }
        }

        EventBus.publish(events.EVENT_ON_PICTURE_TOUCH, {touchPos:touchPos, foundIndex:foundIndex});
    }

    public setNewPicture( data:LevelPictureModel ) : void {
        this._knownDiffsIds.length = 0;

        this.init(data);
    }

    private drawDiff( p : LevelPictureDifference ) : void {
        const g1:PIXI.Graphics = p.getPolygonGraphics();
        this._picture1.addChild(g1);

        const g2:PIXI.Graphics = g1.clone();
        this._picture2.addChild(g2);

    }

}
