import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSprite from "../../../components/CSprite";
import Resource from "../../../data/Resource";
import * as constants from "../../../constants/constants";
import {ContainerModel} from "../../../models/PropertiesModels";
import {LocationModel, OpenLocationModel} from "../../../models/ApiModels";
import Locations from "../../../data/Locations";
import WindowsController from "../../windows/WindowsController";
import OpenLocationWindow from "../../windows/OpenLocationWindow";
import Api from "../../../utils/Api";
import * as urls from "../../../constants/urls";
import EventBus from "../../../utils/EventBus";
import * as events from "../../../constants/events";
import {EVENT_ON_LOCATION_OPEN} from "../../../constants/events";
import LocationClosedWindow from "../../windows/LocationClosedWindow";

export default class Fence extends CContainer {
    private _closed: CSprite;
    private _opened: CSprite;
    private _ribbon: CContainer;
    private _key: CSprite;

    private _locationId: number = 0;
    private _locationData: LocationModel = null;
    private _stars: number = 0;

    private _keysWins: number;

    constructor( props: ContainerModel ) {
        super( props );

        this._closed = this.getComponentByName("closed");
        this._opened = this.getComponentByName("opened");
        this._ribbon = this.getComponentByName("ribbon");

        this._key = this._ribbon.getComponentByName("key");

        //this.positionTest();
    }

    setId(id: number): void {
        this._locationId = id;
        this._locationData = Locations.getLocationByID(id);
    }

    getId(): number {
        return this._locationId;
    }

    setStars(num: number): void {
        this._stars = num;
    }

    getKey() : CSprite {
        return this._key;
    }

    winKey() : void {
        this._key.visible = true;
    }

    setOpened() : void {
        this._ribbon.visible = false;
        this._closed.visible = false;
        this._opened.visible = true;
    }

    open(): void {
       gsap.to( this._ribbon, {
           duration: 0.3,
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

            const locationMaxStars: number = this._locationData.openNextStars;

            if ( this._stars >= locationMaxStars ) {
                WindowsController.instance().show(OpenLocationWindow, null);
            } else {
                WindowsController.instance().show(LocationClosedWindow, {price:this._locationData.openNextPrice,stars:this._locationData.openNextStars});
            }

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
