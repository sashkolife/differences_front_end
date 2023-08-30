import * as PIXI from 'pixi.js';

export default class LevelPictureDifference {
    private readonly _polygon: PIXI.Polygon;
    constructor( private _id: number, private _polygonData:number[][] ) {
        this._polygon = new PIXI.Polygon( _polygonData.flat() );
    }

    public contains(x:number,y:number) : boolean {
        return this._polygon.contains(x,y);
    }

    public getPolygonGraphics() : PIXI.Graphics {
        const g:PIXI.Graphics = new PIXI.Graphics();
        g.lineStyle(5, 0xeb8f34);
        g.drawPolygon(this._polygon);
        return g;
    }
}