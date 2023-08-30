import User from "../data/User";

export default class Api {
    public static async request( url : string, params? : any, method : string = "GET" ) {
        const reqInit: RequestInit = {};
        if ( User.token ) {
            reqInit.headers = {'Authorization': User.token };
        }
        reqInit.method = method;

        return await fetch( url, reqInit );
    }
}