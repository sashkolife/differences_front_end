import { Howl, Howler } from 'howler';
import * as sender from "../utils/Sender.js";
import * as events from "../constants/events.js";
import {URL_JSON_SOUND_SPRITE} from "../constants/Urls";

export default class Sounds {
    private static _soundsJson:any = null;
    private static _soundSprite:Howl = null;
    private static _allowAudio = true;
    private static _soundIds:any = {};
    private static _fadeTimeout:any = {};

    public static async loadSoundsJson() {
        this._soundsJson = await fetch( URL_JSON_SOUND_SPRITE );
    }

    public static async loadSounds() {
        return new Promise( (resolve, reject) => {
            if ( this._soundsJson ) {
                this._soundSprite = new Howl( this._soundsJson );
                this._soundSprite.once("loaderror", ()=>{reject("Sounds not loaded");});
                this._soundSprite.once("load", resolve);
            }
        });
    }

    public static isAudioAllowed() : boolean {
        return this._allowAudio;
    }

    public static setAllowAudio( allow : boolean ) : void {
        this._allowAudio = allow;

        if ( this.isLocalStorageSupported() ) {

            const obj : any = { "audio": this._allowAudio }

            try {
                localStorage.setItem("audio", JSON.stringify(obj));
            } catch (ex) {}
        }

        Howler.mute(!this._allowAudio);
    }

    private static isLocalStorageSupported() : boolean {
        let supported: boolean = false;

        if ( typeof(Storage) !== "undefined" ) {
            supported = true;
        }

        return supported;
    }

    public static getAudioSettings() : void {
        try {
            const obj : any = JSON.parse( localStorage.getItem("audio") );
            if ( obj ) {
                this._allowAudio = obj["audio"];
                Howler.mute(!this._allowAudio);
            }
        } catch (ex) {}
    }

    public static playSound( soundName: string, loop: boolean = false, volume: number = 1) : number {

        if ( !this._allowAudio ) return null;

        this.stopSound( soundName );

        if ( soundName ) {

            const soundId : number = this._soundSprite.play(soundName);

            this._soundIds[soundName] = soundId;

            this._soundSprite.volume(soundId, volume);

            if ( loop ) {
                this._soundSprite.loop(true, soundId);
            }

            return soundId;
        }

        return null;
    }

    public static isPlaying( soundName: string ) : boolean {
        const soundId:number = this._soundIds[soundName];
        if ( soundId ) {
            return this._soundSprite.playing(soundId);
        }

        return false;
    }

    public static stopSound( soundName: string ) : void {

        const soundId:number = this._soundIds[soundName];
        if ( soundName && soundId ) {

            if ( this._fadeTimeout[soundName] ) {
                clearTimeout(this._fadeTimeout[soundName]);
                delete this._fadeTimeout[soundName];
            }

            this._soundSprite.stop( soundId );

            delete this._soundIds[soundName];

        }
    }

    public static fadeAndStopSound(soundName: string, fadeTime: number): void {

        const soundId: number = this._soundIds[soundName];

        if ( soundName && soundId ) {
            this._soundSprite.fade( 1, 0, fadeTime, soundId );

            this._fadeTimeout[soundName] = setTimeout((sn: string)=>{
                this.stopSound(sn);
            }, fadeTime, soundName );

        }
    }
}

const onPageVisible = () => {
    if ( Sounds.isAudioAllowed() && Howler ) {
        Howler.mute(false);
    }
};

const onPageHidden = () => {
    if ( Howler ) {
        Howler.mute(true);
    }
};

sender.subscribe(events.EVENT_ON_PAGE_HIDDEN, onPageVisible);
sender.subscribe(events.EVENT_ON_PAGE_VISIBLE, onPageHidden);

Sounds.getAudioSettings();