import * as PIXI from 'pixi.js';
import gsap from "gsap";
import CSprite from "../../../components/CSprite";
import CContainer from "../../../components/CContainer";
import CSlice9 from "../../../components/CSlice9";
import {PictureModel, PicturePropsModel} from "../../../models/PropertiesModels";
import {FederatedPointerEvent, Point} from "pixi.js";
import EventBus from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import LevelPictureDifference from "./LevelPictureDifference";
import {debug} from "../../../App";

export default class LevelPicture extends CContainer {
    properties:PictureModel;

    private _picture: CSprite;
    private _border: CSlice9;

    private _pictScale: number = 1;

    private _differences: LevelPictureDifference[] = [];

    private _helpViews: any = {};
    private _foundViews: any = {};

    private _pictOrient: PicturePropsModel = null;

    constructor( props: PictureModel ) {
        super( props );
        this._picture = this.getComponentByName("picture");
        this._border = this.getComponentByName("border");

        const onPictureTouch: Function = this.onPictureTouchEnd.bind(this);
        (this._picture as any).on("mouseup", onPictureTouch);
        (this._picture as any).on("touchend", onPictureTouch);

        this.setActive(true);
    }

    setPicture( pictTextureKey:string ) : void {
        this.clear();

        const pTexture:PIXI.Texture = PIXI.Texture.from(pictTextureKey);
        this._picture.texture = pTexture;

        if ( pTexture.width > pTexture.height ) { //Horizontal
            this._pictOrient = this.properties.horizontalProps;
            this._pictScale = this._pictOrient.height/pTexture.height;
        } else { //Vertical
            this._pictOrient = this.properties.verticalProps;
            this._pictScale = this._pictOrient.width/pTexture.width;
        }
        this._picture.width = pTexture.width*this._pictScale;
        this._picture.height = pTexture.height*this._pictScale;
        this.x = -(this._picture.width/2);
        this.y = -(this._picture.height/2);

        this._border.width = this._picture.width + Math.abs(this._border.x*2);
        this._border.height = this._picture.height + Math.abs(this._border.y*2);

        this._border.visible = true;
    }

    performPolygons(pictKeyJson:string) : void {

        const jData: number[][][] = PIXI.Assets.cache.get(pictKeyJson);

        this._differences.length = 0;

        for (let i: number = 0; i < jData.length; i++) {
            if (jData[i].length == 2) {
                jData[i].push([jData[i][0][0], jData[i][1][1]]);
                jData[i].splice(1, 0, [jData[i][1][0], jData[i][0][1]]);
            }
            this._differences.push(new LevelPictureDifference(i, jData[i]));
        }

        if (debug) {
            for ( let i : number = 0; i < this._differences.length; i++ ) {
                const p: PIXI.Polygon = this.getScalePolygon(i);
                const g:PIXI.Graphics = new PIXI.Graphics();
                g.lineStyle(3, 0xffffff);
                g.drawPolygon(p);
                this.addChild(g);
            }
        }
    }

    setActive(value: boolean): void {
        (this._picture as any).interactive = value;
    }

    private getScalePolygon(diffId: number): PIXI.Polygon {
        const p: PIXI.Polygon = this._differences[diffId].getPolygon();
        for (let i:number = 0; i < p.points.length; i++) {
            p.points[i] = p.points[i]*this._pictScale;
        }
        return p;
    }

    showDiff(diffId: number, animate: boolean = false): void {
        this.clearHelp(diffId);
        const p: PIXI.Polygon = this.getScalePolygon(diffId);
        const g:PIXI.Graphics = new PIXI.Graphics();
        g.lineStyle(4, 0xff5500, 0.5);
        g.drawPolygon(p);
        g.lineStyle(2, 0xffff00, 0.8);
        g.drawPolygon(p);
        this.addChild(g);
        this._foundViews[diffId] = g;
        if ( animate ) {
            this.animateDiff(p);
        }
    }

    showHelp(diffId: number, animate: boolean = false): void {
        this.clearHelp(diffId);
        const p: PIXI.Polygon = this.getScalePolygon(diffId);
        const g:PIXI.Graphics = new PIXI.Graphics();
        g.lineStyle(4, 0x0055ff, 0.8);
        g.drawPolygon(p);
        g.lineStyle(2, 0xccccff, 1);
        g.drawPolygon(p);
        this.addChild(g);
        this._helpViews[diffId] = g;
        if ( animate ) {
            this.animateDiff(p);
        }
    }

    private animateDiff(p:PIXI.Polygon): void {
        let animG:PIXI.Graphics = new PIXI.Graphics();
        animG.lineStyle(8, 0xffffff, 0.8);
        animG.drawPolygon(p);
        this.addChild(animG);
        gsap.to(animG, {duration: 0.7, alpha:0, ease: "none", onComplete: () => {
                this.removeChild(animG);
                animG.destroy(true);
            }
        });
    }

    getDiffCenter(diffId: number): PIXI.Point {
        const points: number[][] = this._differences[diffId].getPolygonData();
        let minX: number = points[0][0];
        let maxX: number = points[0][0];
        let minY: number = points[0][1];
        let maxY: number = points[0][1];
        for ( let i: number = 1; i < points.length; i++ ) {
            if ( points[i][0] > maxX ) {
                maxX = points[i][0];
            }
            if ( points[i][0] < minX ) {
                minX = points[i][0];
            }
            if ( points[i][1] > maxY ) {
                maxY = points[i][1];
            }
            if ( points[i][1] < minY ) {
                minY = points[i][1];
            }
        }
        return this.toGlobal(new Point((minX+(maxX-minX)/2)*this._pictScale, (minY+(maxY-minY)/2)*this._pictScale));
    }

    moveToPosition(callback?:Function): void {
        this.alpha = 0;
        this.visible = true;
        gsap.to(this, {duration: 0.5, x: "-="+this._pictOrient.x, y: "-="+this._pictOrient.y, alpha: 1, ease: "power3.in", onComplete: () => {if (callback) callback()}});
    }

    moveToOut(callback?:Function): void {
        this.alpha = 1;
        gsap.to(this, {duration: 0.5, x: "-="+(this._pictOrient.x*2), y: "-="+(this._pictOrient.y*2), alpha: 0, ease: "power3.in", onComplete: () => {
            if (callback) {
                callback();
                this.visible = false;
                this.x = 0;
                this.y = 0;
            }
        }});
    }

    private clearHelp( diffId: number ) : void {
        if ( this._helpViews[diffId] ) {
            this._helpViews[diffId].removeFromParent();
            this._helpViews[diffId].destroy(true);
            delete this._helpViews[diffId];
        }
    }

    private clearDiff( diffId: number ) : void {
        if ( this._foundViews[diffId] ) {
            this._foundViews[diffId].removeFromParent();
            this._foundViews[diffId].destroy(true);
            delete this._foundViews[diffId];
        }
    }

    private onPictureTouchEnd( e: FederatedPointerEvent ) : void {
        const touchPos:Point = e.getLocalPosition(this._picture);

        let foundIndex:number = this.getDifferenceIDByPos(touchPos);

        EventBus.publish(events.EVENT_ON_PICTURE_TOUCH, {touchPos:touchPos, screenPos: e.screen, foundIndex:foundIndex});
    }

    private getDifferenceIDByPos( pos: PIXI.Point ): number {
        for ( let i : number = 0; i < this._differences.length; i++ ) {
            if ( this._differences[i].contains(pos.x, pos.y) ) {
                return i;
            }
        }
        return -1;
    }

    private clear(): void {
        this._picture.texture = null;

        for ( let diffId in this._helpViews ) {
            this.clearHelp(parseInt(diffId));
        }
        for ( let diffId in this._foundViews ) {
            this.clearDiff(parseInt(diffId));
        }
    }
}
