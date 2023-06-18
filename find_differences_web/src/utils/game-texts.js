import * as check from "./check.js";

let gameTexts = null;

export const setGameTexts = texts => {
    gameTexts = texts;
}

export const getGameText = textId => {
    return gameTexts[textId]||textId;
}

export const replaceString = (str, data) => {
    if ( check.isAvailable(data) ) {
        for (let k in data) {
            str = str.replace("{" + k + "}", data[k]);
        }
    }
    return str;
}