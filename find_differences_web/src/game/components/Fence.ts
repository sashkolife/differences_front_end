import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../components/CContainer";
import CText from "../../components/CText";
import CSprite from "../../components/CSprite";
import Resource from "../../data/Resource";
import * as constants from "../../constants/constants";
import {ContainerModel} from "../../models/PropertiesModels";

export default class Fence extends CContainer {
    private _closed: CSprite;
    private _opened: CSprite;
    private _ribbon: CContainer;
    private _keys: Array<CSprite>;

    private _keysWins: number;

    constructor( props: ContainerModel ) {
        super( props );

        this._closed = this.getComponentByName("closed");
        this._opened = this.getComponentByName("opened");
        this._ribbon = this.getComponentByName("ribbon");

        this._keys = [
            this._ribbon.getComponentByName("key0"),
            this._ribbon.getComponentByName("key1"),
            this._ribbon.getComponentByName("key2")
        ];

        //this.positionTest();
    }

    setKeys( value: number ) : void {
        this._keysWins = value;
        for ( let i: number = 0; i < this._keysWins; i++ ) {
            this._keys[i].visible = true;
        }
    }

    winKey( num: number ) : void {
        this._keys[num].visible = true;
    }

    setOpened() : void {
        this._ribbon.visible = false;
        this._closed.visible = false;
        this._opened.visible = true;
    }

    open(): void {
       gsap.to( this._ribbon, {
           alpha:0,
           onComplete: () => {
               this.setOpened();
           }
       } );
    }

    setActive() : void {
        this._ribbon.visible = true;
    }

    setInteractive( value:boolean ) : void {
        const self:any = this;

        self.cursor = value ? "pointer" : "none";
        self.interactive = value;

        const onClick: Function = () => {

        }

        self.onpointerup = value ? onClick : null;

    }

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
    //         console.log("{", this.position.x, this.position.y, "}");
    //     };
    //     self.onmouseupoutside = () => {
    //         // console.log(e);
    //         isDrag = false;
    //         self.parent.interactive = false;
    //         self.parent.parent.interactive = true;
    //     };
    // }

}
