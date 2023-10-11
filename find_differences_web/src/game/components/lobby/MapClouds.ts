import CContainer from "../../../components/CContainer";
import * as constants from "../../../constants/constants";
import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { MapCloudsModel} from "../../../models/PropertiesModels";
import CSprite from "../../../components/CSprite";

export default class MapClouds extends CContainer {

    properties:MapCloudsModel;

    constructor( props: MapCloudsModel ) {
        super( props );

        this.alignClouds();
    }

    public alignClouds() : void {
        const exactness: number = 0.999;
        this.children.forEach( (cloud:any) => {
            cloud.onOrientationChange();
            const rX: number = this.properties.randomX[Math.floor(Math.random()*this.properties.randomX.length*exactness)];
            const rY: number = this.properties.randomY[Math.floor(Math.random()*this.properties.randomY.length*exactness)];
            const rScale: number = this.properties.randomScale[Math.floor(Math.random()*this.properties.randomScale.length*exactness)];
            const rAlpha: number = this.properties.randomAlpha[Math.floor(Math.random()*this.properties.randomAlpha.length*exactness)];
            const rAngle: number = this.properties.randomAngle[Math.floor(Math.random()*this.properties.randomAngle.length*exactness)];
            cloud.x += rX;
            cloud.y += rY;
            cloud.scale.set(rScale, rScale);
            cloud.alpha = rAlpha;
            cloud.angle = rAngle;
            gsap.to( cloud, {duration: 15, "x": "-="+rX, repeat: -1, yoyo: true } );
        });
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        this.children.forEach( (cloud:any) => {
            gsap.killTweensOf( cloud );
        });
        super.destroy(_options);
    }

    public clearClouds(callback: Function): void {
        for ( let i: number = 0; i < this.children.length; i++) {
            const cloud: CSprite = this.children[i] as CSprite;
            gsap.killTweensOf(cloud);
            const rx: string = cloud.x < 1000 ? "-=1200" : "+=1200";
            gsap.to( cloud, {duration: 2, "x": rx, onComplete: i === this.children.length-1 ? () => callback() : null } );
        }
    }
}