import * as PIXI from 'pixi.js';

export default class LevelPictureDifference {
    private readonly _polygon: PIXI.Polygon;
    constructor( private _id: number, private _polygonData:number[][] ) {
        this._polygon = new PIXI.Polygon( _polygonData.flat() );
    }

    public getId(): number {
        return this._id;
    }

    public contains(x:number,y:number) : boolean {
        return this._polygon.contains(x,y);
    }

    public getPolygon() : PIXI.Polygon {
        return this._polygon.clone();
    }
}