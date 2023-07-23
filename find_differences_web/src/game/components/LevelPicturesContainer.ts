import * as PIXI from 'pixi.js';
import CSprite from "../../components/CSprite";
import CContainer from "../../components/CContainer";
import {LevelPictureModel} from "../../data/models";
import {game} from "../../App";

export default class LevelPicturesContainer extends CContainer {

    private _picture1h: CSprite;
    private _picture2h: CSprite;
    private _picture1v: CSprite;
    private _picture2v: CSprite;

    private _picture1: CSprite;
    private _picture2: CSprite;

    constructor( props: any ) {
        super( props );
        this._picture1h = this.getComponentByName("picture1h");
        this._picture2h = this.getComponentByName("picture2h");
        this._picture1v = this.getComponentByName("picture1v");
        this._picture2v = this.getComponentByName("picture2v");
    }

    init( data:LevelPictureModel ) : void {
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

        this._picture1.texture = p1Texture;
        this._picture2.texture = p2Texture;

        const jData: Array<any> = PIXI.Assets.cache.get(data.pictKeyJson).differences;
        for ( let i : number = 0; i < jData.length; i++ ) {
            const g:PIXI.Graphics = new PIXI.Graphics();
            g.beginFill(0xff00ff);
            g.moveTo(jData[i][0].x, jData[i][0].y);
            for ( let j: number = 1; j < jData[i].length; j++ ) {
                g.lineTo(jData[i][j].x, jData[i][j].y);
            }
            g.lineTo(jData[i][0].x, jData[i][0].y);
            g.endFill();
            this._picture1.addChild(g);

            const g2: PIXI.Graphics = g.clone();
            this._picture2.addChild(g2);
        }
    }

}
