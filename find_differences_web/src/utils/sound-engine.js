import { Howl, Howler } from 'howler';
import * as check from "./check.js";
import * as sender from "../events/event-bus.js";
import * as events from "../constants/events.js";

let soundSprite = null;

let allowAudio = true;

const soundIds = {};

const fadeTimeout = {};

export const loadSounds = (json) => {
    return new Promise( (resolve, reject) => {
        if ( check.isAvailable(json) ) {
            soundSprite = new Howl( json );
            soundSprite.once("loaderror", ()=>{reject("Sounds not loaded");});
            soundSprite.once("load", resolve);
        }
    });
}

export const isAudioAllowed = () => allowAudio;

export const setAllowAudio = allow => {

    allowAudio = allow;

    if ( isLocalStorageSupported() ) {

        const obj = { "audio": allowAudio }

        try {
            localStorage.setItem("audio", JSON.stringify(obj));
        } catch (ex) {}
    }

    if (check.isAvailable(Howler, Object)) {
        Howler.mute(!allowAudio);
    }
}


const isLocalStorageSupported = () => {

    let supported = false;

    if ( typeof(Storage) !== "undefined" ) {
        supported = true;
    }

    return supported;

}

const getAudioSettings = () => {

    try {
        const obj = JSON.parse( localStorage.getItem("audio") );
        if ( check.isAvailable(obj) ) {
            allowAudio = obj["audio"];
            Howler.mute(!allowAudio);
        }
    } catch (ex) {}
}

export const playSound = (soundName, loop = false, volume = 1) => {

    if ( !allowAudio ) return null;

    stopSound( soundName );

    if ( check.isAvailable( soundName ) ) {

        const soundId = soundSprite.play(soundName);

        soundIds[soundName] = soundId;

        soundSprite.volume(soundId, volume);

        if ( loop ) {
            soundSprite.loop(true, soundId);
        }

        return soundId;
    }

    return null;
}

export const isPlaying = ( soundName ) => {

    const soundId = soundIds[soundName];
    if ( check.isAvailable(soundId) ) {
        if ( check.isAvailable(soundSprite) ) {
            return soundSprite.playing(soundId);
        }
    }

    return false;

}

export const stopSound = soundName => {

    const soundId = soundIds[soundName];
    if ( check.isAvailable(soundName) && check.isAvailable(soundId) ) {

        if ( check.isAvailable(fadeTimeout[soundName]) ) {
            clearTimeout(fadeTimeout[soundName]);
            delete fadeTimeout[soundName];
        }

        if ( check.isAvailable(soundSprite) ) {
            soundSprite.stop( soundId );
        }

        delete soundIds[soundName];

    }
}

export const fadeAndStopSound = (soundName, fadeTime) => {

    const soundId = soundIds[soundName];

    if ( check.isAvailable(soundName) && check.isAvailable(soundId) ) {
        if ( check.isAvailable(soundSprite) ) {
            soundSprite.fade( 1, 0, fadeTime, soundId );
        }

        fadeTimeout[soundName] = setTimeout((sn)=>{
            stopSound(sn)
        }, fadeTime, soundName );

    }
}

const onPageVisible = () => {
    if ( isAudioAllowed() && check.isAvailable(Howler) ) {
        Howler.mute(false);
    }
};

const onPageHidden = () => {
    if ( check.isAvailable(Howler) ) {
        Howler.mute(true);
    }
};

sender.subscribe(events.EVENT_ON_PAGE_HIDDEN, onPageVisible);
sender.subscribe(events.EVENT_ON_PAGE_VISIBLE, onPageHidden);

getAudioSettings();