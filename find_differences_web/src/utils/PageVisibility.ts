// import * as sender from './Sender.js';
// import * as events from "../constants/events.js";
//
// const testPageVisibilityApi = () => {
//
//     if ( prefix !== null){
//
//         document.addEventListener(prefix + "visibilitychange", onVisibilityChange );
//
//     }
// }
//
// const onVisibilityChange = () => {
//
//     if ( document.hidden === false || document[ prefix + "Hidden" ] === false ){
//
//         sender.publish(events.EVENT_ON_PAGE_HIDDEN);
//
//     } else {
//
//         sender.publish(events.EVENT_ON_PAGE_VISIBLE);
//
//     }
// }
//
// const getPrefix = () => {
//     let prefix = null;
//
//     if ( document.hidden !== undefined ) {
//
//         prefix = "";
//
//     } else {
//
//         const browserPrefixes: Array<string> = [ "webkit","moz","ms","o" ];
//         // Test all vendor prefixes
//         for ( let i = 0; i < browserPrefixes.length; i++ ) {
//             if ( document[browserPrefixes[i] + "Hidden"] != undefined ) {
//                 prefix = browserPrefixes[i];
//                 break;
//             }
//         }
//     }
//
//     return prefix;
// }
//
// const prefix : string = getPrefix();
//
// window.addEventListener("load", testPageVisibilityApi );