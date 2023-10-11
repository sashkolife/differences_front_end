import {Point} from "pixi.js";

export interface BalanceUpdateEvent {
    coins:number;
    isAnimate?:boolean;
}

export interface PictureTouchEvent {
    touchPos: Point;
    screenPos: Point;
    foundIndex:number;
}