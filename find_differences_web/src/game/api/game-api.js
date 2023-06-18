import {get, requestDelete} from "../../network/network-comm.js";
import * as urls from "../../network/urls.js";
import * as app from "../../app.js";
import * as check from "../../utils/check.js";

const getSettingsUrl = () => {

    if(check.isAvailable(app.mode) && check.isAvailable(app.sessionId)) {

        return urls.apiUrl+urls.URL_PARTS_SETTINGS+urls.URL_QUESTION_MARK+urls.URL_ATTR_GAME_ID+urls.URL_EQUAL_MARK+app.gameId+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_USER_ID+urls.URL_EQUAL_MARK+app.userId+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_MODE+urls.URL_EQUAL_MARK+app.mode+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_SESSION_ID+urls.URL_EQUAL_MARK+app.sessionId+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_DEVICE+urls.URL_EQUAL_MARK+app.deviceStr+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_LANG+urls.URL_EQUAL_MARK+app.lang+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_SIGN+urls.URL_EQUAL_MARK+app.currencySign;

    }

    if(check.isAvailable(app.currencySign)) {

        return urls.apiUrl+urls.URL_PARTS_SETTINGS+urls.URL_QUESTION_MARK+urls.URL_ATTR_GAME_ID+urls.URL_EQUAL_MARK+app.gameId+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_USER_ID+urls.URL_EQUAL_MARK+app.userId+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_DEVICE+urls.URL_EQUAL_MARK+app.deviceStr+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_LANG+urls.URL_EQUAL_MARK+app.lang+
            urls.URL_AMPERSAND_MARK+urls.URL_ATTR_SIGN+urls.URL_EQUAL_MARK+app.currencySign;

    }

    return urls.apiUrl+urls.URL_PARTS_SETTINGS+urls.URL_QUESTION_MARK+urls.URL_ATTR_GAME_ID+urls.URL_EQUAL_MARK+app.gameId+
        urls.URL_AMPERSAND_MARK+urls.URL_ATTR_USER_ID+urls.URL_EQUAL_MARK+app.userId+
        urls.URL_AMPERSAND_MARK+urls.URL_ATTR_DEVICE+urls.URL_EQUAL_MARK+app.deviceStr+
        urls.URL_AMPERSAND_MARK+urls.URL_ATTR_LANG+urls.URL_EQUAL_MARK+app.lang;

}

const getPagesUrl = () => {
    return urls.apiUrl+urls.URL_PARTS_PAGES+urls.URL_QUESTION_MARK+urls.URL_ATTR_GAME_ID+urls.URL_EQUAL_MARK+app.gameId+
        urls.URL_AMPERSAND_MARK+urls.URL_ATTR_LANG+urls.URL_EQUAL_MARK+app.lang;
}

const getDistributionUrl = () => {
    return urls.apiUrl + urls.URL_PARTS_OUTCOME + urls.URL_SLASH + urls.URL_PARTS_DISTRIBUTION + urls.URL_QUESTION_MARK + urls.URL_ATTR_GAME_ID + urls.URL_EQUAL_MARK + app.gameId +
        urls.URL_AMPERSAND_MARK + urls.URL_ATTR_USER_ID + urls.URL_EQUAL_MARK + app.userId +
        urls.URL_AMPERSAND_MARK + urls.URL_ATTR_DENOMINATION_INDEX + urls.URL_EQUAL_MARK + app.denominationIndex;
}

const getCompleteUrl = ( outcomeId, outcomeMode ) => {
    return urls.apiUrl + urls.URL_PARTS_OUTCOME + urls.URL_SLASH + urls.URL_PARTS_COMPLETE + urls.URL_QUESTION_MARK + urls.URL_ATTR_GAME_ID + urls.URL_EQUAL_MARK + app.gameId +
        urls.URL_AMPERSAND_MARK + urls.URL_ATTR_USER_ID + urls.URL_EQUAL_MARK + app.userId +
        urls.URL_AMPERSAND_MARK + urls.URL_ATTR_OUTCOME_ID + urls.URL_EQUAL_MARK + outcomeId +
        urls.URL_AMPERSAND_MARK + urls.URL_ATTR_MODE + urls.URL_EQUAL_MARK + outcomeMode;
}

const getDeleteOutcomeUrl = () => {
    return urls.apiUrl + urls.URL_PARTS_OUTCOME + urls.URL_SLASH + urls.URL_PARTS_DELETE_OUTCOME + urls.URL_QUESTION_MARK + urls.URL_ATTR_GAME_ID + urls.URL_EQUAL_MARK + app.gameId +
        urls.URL_AMPERSAND_MARK + urls.URL_ATTR_USER_ID + urls.URL_EQUAL_MARK + app.userId;
}

const getRoundUrl = () => {
    return urls.apiUrl+urls.URL_PARTS_OUTCOME+urls.URL_QUESTION_MARK+urls.URL_ATTR_GAME_ID+urls.URL_EQUAL_MARK+app.gameId+
        urls.URL_AMPERSAND_MARK+urls.URL_ATTR_USER_ID+urls.URL_EQUAL_MARK+app.userId+
        urls.URL_AMPERSAND_MARK+urls.URL_ATTR_DENOMINATION_INDEX+urls.URL_EQUAL_MARK+app.denominationIndex;
}

export const settings = async () => {
    const url = getSettingsUrl();
    return await fetch(url);
}

export const pages = async () => {
    const url = getPagesUrl();
    return await get(url);
}

export const distribution = async () => {
    const url = getDistributionUrl();
    return await get( url );
}

export const roundOutcome = async () => {
    const url = getRoundUrl();
    return await get( url );
}

export const complete = async (outcomeId, outcomeMode) => {
    const url = getCompleteUrl(outcomeId, outcomeMode);
    return await get( url );
}

export const deleteOutcome = async () => {
    const url = getDeleteOutcomeUrl();
    return await get( url );
}