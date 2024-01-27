import * as PIXI from 'pixi.js';
import CSprite from "../../../components/CSprite";
import Resource from "../../../data/Resource";
import * as animate from "@pixi/animate";
import {LocationBackgroundModel} from "../../../models/PropertiesModels";
import gsap from "gsap";

export default class LocationBackground extends CSprite {
    properties:LocationBackgroundModel;

    private static readonly _scene: animate.Scene = new animate.Scene();
    private static readonly _texturesCache: any = {};
    private static readonly _animationsData: any = {};

    private _isLoading: boolean = false;
    private _animation: animate.MovieClip = null;

    private _isAnimationPlayed: boolean = true;

    constructor( props: LocationBackgroundModel, private _onLoaded: Function) {
        super( props );
    }

    load() : void {
        if ( !this._isLoading ) {
            this._isLoading = true;

            const animName: string = this.properties.animation;

            const loadMovieClip: Function = (aName: string) => {
                if ( LocationBackground._animationsData[aName] ) {
                    LocationBackground._scene.load(LocationBackground._animationsData[aName], (a: animate.MovieClip) => {
                        this._animation = a;
                        this.addChild(this._animation);
                        if ( !this._isAnimationPlayed ) {
                            this.stopMovieClip( this._animation );
                        }
                    });
                }
            }

            const loadAnimation: Function = async (aName: string) => {
                try {
                    if ( !LocationBackground._animationsData[aName] ) {
                        const animationData: any = await import("../../../flash/locations/" + aName + ".js");
                        animationData.default.setup(animate);
                        LocationBackground._animationsData[aName] = animationData.default;
                    }
                    loadMovieClip(aName);
                } catch (err) {
                    console.log(err);
                }
            };

            const texture: PIXI.Texture = LocationBackground._texturesCache[this.properties.textureFull];
            if (texture) {
                this.texture = texture;
                loadAnimation(animName);
            } else {
                Resource.loadList([this.properties.textureFull], null).then(async () => {
                    LocationBackground._texturesCache[this.properties.textureFull] =
                        this.texture = Resource.getTexture(this.properties.textureFull);
                    loadAnimation(animName);
                    this.alpha = 0;
                    gsap.to(this, {duration: 1.2, alpha: 1, onComplete: () => this._onLoaded()});
                }).catch(() => {
                    this._isLoading = false;
                });
            }
        }
        this.play();
    }

    stop() : void {
        if ( this._animation && this._isAnimationPlayed ) {
            this.stopMovieClip( this._animation );
        }
        this._isAnimationPlayed = false;
    }

    play() : void {
        if ( this._animation && !this._isAnimationPlayed ) {
            this.playMovieClip( this._animation );
            this._isAnimationPlayed = true;
        }
    }

    stopMovieClip( mc: animate.MovieClip ) : void {
        mc.stop();
        if ( mc.children ) {
            mc.children.forEach( (obj:any) => {
                if ( obj instanceof animate.MovieClip ) {
                    this.stopMovieClip( obj );
                }
            } )
        }
    }

    playMovieClip( mc:animate.MovieClip ) : void {
        mc.play();
        if ( mc.children ) {
            mc.children.forEach( (obj:any) => {
                if ( obj instanceof animate.MovieClip ) {
                    this.playMovieClip( obj );
                }
            } )
        }
    }
}