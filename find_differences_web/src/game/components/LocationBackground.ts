import CSprite from "../../components/CSprite";
import Resource from "../../data/Resource";
import * as animate from "@pixi/animate";
import {LocationBackgroundModel} from "../../models/PropertiesModels";

export default class LocationBackground extends CSprite {
    properties:LocationBackgroundModel;

    private static readonly _scene: animate.Scene = new animate.Scene();
    private static readonly _animationsData: any = {};

    private _isLoading: boolean = false;
    private _animation: animate.MovieClip = null;

    private _isAnimationPlayed: boolean = true;

    constructor( props: LocationBackgroundModel ) {
        super( props );
    }

    load() : void {
        if ( !this._isLoading ) {
            this._isLoading = true;

            const animName: string = this.properties.animation;

            const loadMovieClip: Function = () => {
                if ( LocationBackground._animationsData[animName] ) {
                    LocationBackground._scene.load(LocationBackground._animationsData[animName], (a: animate.MovieClip) => {
                        this._animation = a;
                        this.addChild(this._animation);
                        if ( !this._isAnimationPlayed ) {
                            this.stopMovieClip( this._animation );
                        }
                    });
                }
            }

            Resource.loadLocations([this.properties.textureFull], null).then(async () => {
                this.texture = Resource.getTexture(this.properties.textureFull);

                try {
                    if ( !LocationBackground._animationsData[animName] ) {
                        const animationData: any = await import("../../flash/locations/" + animName + ".js");
                        animationData.default.setup(animate);
                        LocationBackground._animationsData[animName] = animationData.default;
                    }
                    loadMovieClip();
                } catch (err) {
                    console.log(err);
                }

            }).catch(() => {
                this._isLoading = false;
            });
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