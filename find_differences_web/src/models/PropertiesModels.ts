import * as PIXI from "pixi.js";
import gsap from "gsap";

export interface ComponentModel {
    name?:string;
    type?:string;
    id?:number;
    x?:number;
    y?:number;
    width?:number;
    height?:number;
    scale?:PIXI.IPointData;
    alpha?:number;
    anchor?:PIXI.IPointData;
    position?:PIXI.IPointData;
    angle?:number;
    skew?: PIXI.IPointData;
    visible?:boolean;
    portrait?: ComponentModel;
    landscape?: ComponentModel;
}

export interface GraphicsModel extends ComponentModel {
    figure?:{
        fillColor?:string;
        rect?:{
            x:number;
            y:number;
            width:number;
            height:number;
        };
        roundRect?:{
            x:number;
            y:number;
            width:number;
            height:number;
            radius:number;
        }
    };
    textureFull?:string;
}

export interface SpriteModel extends ComponentModel {
    texture?:string;
    textureFull?:string;
}

export interface Slice9Model extends SpriteModel {
    leftWidth?:number;
    rightWidth?:number;
    topHeight?:number;
    bottomHeight?:number;
}

export interface TextModel extends ComponentModel {
    textKey?:string;
    style?: PIXI.TextStyle;
}

export interface BitmapTextModel extends ComponentModel {
    textKey?:string;
    style?: PIXI.IBitmapTextStyle;
}

export interface ContainerModel extends ComponentModel {
    children?:ComponentModel[];
    mask?:string;
}

export interface ButtonStateModel extends Slice9Model {
    btnText?: ComponentModel;
}

export interface ButtonPayStateModel extends ButtonStateModel {
    priceText?: ComponentModel;
    priceImage?: ComponentModel;
}

export interface ButtonModel extends ComponentModel {
    states: {
        normal:ButtonStateModel;
        over:ButtonStateModel;
        down:ButtonStateModel;
        disable:ButtonStateModel;
    };
    enabled?: boolean;
    state?: string;
    btnText?: TextModel|BitmapTextModel;
}

export interface ButtonPayModel extends ButtonModel {
    states: {
        normal:ButtonPayStateModel;
        over:ButtonPayStateModel;
        down:ButtonPayStateModel;
        disable:ButtonPayStateModel;
    };
    priceImage: SpriteModel;
    priceText: TextModel|BitmapTextModel;
}

export interface ContentWindowModel extends ContainerModel {
    show:gsap.TweenVars;
    hide:gsap.TweenVars;
}

export interface LocationBackgroundModel extends SpriteModel {
    animation?:string;
}

export interface MapCloudsModel extends ContainerModel {
    randomX:number[];
    randomY:number[];
    randomScale:number[];
    randomAlpha:number[];
    randomAngle:number[];
}

export interface MapModel extends ContainerModel {
    locationHeight:number;
    locationWidth:number;
}

export interface PictureModel extends ContainerModel {
    horizontalProps: PicturePropsModel;
    verticalProps: PicturePropsModel;
    startX:number;
    startY:number;
    startScale:number;
}

export interface PicturePropsModel {
    x:number;
    y:number;
    width:number;
    height:number;
    hideX:number;
    hideY:number;
}

export interface ParticleAnimationModel extends ComponentModel {
    resourceName: string;
    autoplay: boolean;
}