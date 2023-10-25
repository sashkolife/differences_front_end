import * as PIXI from 'pixi.js';
import * as particles from '@pixi/particle-emitter';
import {ContainerModel, ParticleAnimationModel} from "../models/PropertiesModels";
import Mixin from "../utils/Mixin";
import CBase from "../components/CBase";
import CContainer from "../components/CContainer";

export class ParticleAnimation extends PIXI.Container {
    properties:ParticleAnimationModel;
    setProperties( props:ParticleAnimationModel ) {}
    removeOrientationEvent() {}

    private _emitter: particles.Emitter;
    /*
    descriptor parameters
        {
            name:"particle",
            resourceName:"particle_green", //Key from loader
            type:"particle",
            autoplay:true,
            portrait:{x:0,y:0},
            landscape:{x:0,y:0}
        }
     */
    constructor(props:ParticleAnimationModel) {
        super();
        this.setProperties(props);

        const particleConf: particles.EmitterConfigV3 = PIXI.Assets.cache.get(props.resourceName);

        this._emitter = new particles.Emitter(this, particleConf);

        if (props.autoplay) {
            this.setPlay(props.autoplay);
        }
    }

    setPlay(value: boolean): void {
        this._emitter.autoUpdate = value;
    }

    playOnceAndDestroy( callback: Function ): void {
        this._emitter.playOnceAndDestroy(()=>{
            if ( callback ) {
                callback();
                callback = null;
            }
            this.destroy();
        });
    }

    playOnce( callback: Function ): void {
        this._emitter.autoUpdate = true;
        this._emitter.playOnce( ()=>{
            this._emitter.autoUpdate = false;
            if ( callback ) {
                callback();
                callback = null;
            }
        } );
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        if (this._emitter) {
            this._emitter.destroy();
            this._emitter = null;
        }

        this.removeOrientationEvent();

        super.destroy(_options);
    }
}

Mixin.applyMixins( ParticleAnimation, [CBase] );