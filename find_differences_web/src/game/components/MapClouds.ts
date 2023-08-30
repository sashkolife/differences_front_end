import CContainer from "../../components/CContainer";
import * as constants from "../../constants/constants";
import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { MapCloudsModel} from "../../models/PropertiesModels";

export default class MapClouds extends CContainer {

    properties:MapCloudsModel;

    constructor( props: MapCloudsModel ) {
        super( props );

        this.alignClouds();
    }

    alignClouds() : void {
        const exactness: number = 0.999;
        this.children.forEach( (cloud:any) => {
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
}