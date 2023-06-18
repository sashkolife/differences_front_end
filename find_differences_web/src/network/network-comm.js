import axios from 'axios';

const CONNECTION_TIMEOUT = 10000;

export const get = async url => {

    try {

        const result = await axios({
            method: 'get',
            url: url,
            timeout: CONNECTION_TIMEOUT
        });

        return result.data;

    } catch(error) {
        throw error;
    }
}

export const post = async (url, payloadJson) => {

    const cfg = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout: CONNECTION_TIMEOUT
    }

    try {

        const result = await axios.post(url, payloadJson, cfg).then(function (res) {
            return res.data;
        })

        return result.data;

    } catch(error) {
        throw error;
    }
}
