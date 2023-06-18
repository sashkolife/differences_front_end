export const isAvailable = (obj, type) => {

    let available = false;

    if(type !== undefined) {

        if(obj !== null && obj !== undefined && obj.constructor === type) {

            available = true;

        }

    } else {

        if(obj !== null && obj !== undefined) {

            available = true;

        }

    }

    return available;

}

export const isFunction = (func) => {

    let available = false;

    if( isAvailable(func) && typeof func === "function") {

        available = true;

    }

    return available;

}

export const isArray = (obj) => {

    return Array.isArray(obj);

}
