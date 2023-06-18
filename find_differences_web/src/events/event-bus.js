const subscriptions = {};

let id = 0;

export const subscribe = (eventType, callback) => {

    id += 1;

    if(!subscriptions[eventType])
        subscriptions[eventType] = { }

    subscriptions[eventType][id] = callback

    return { 
        unsubscribe: () => {
            delete subscriptions[eventType][id]
            if(Object.keys(subscriptions[eventType]).length === 0) delete subscriptions[eventType]
        }
    }
}

export const publish = (eventType, arg) => {
    if(!subscriptions[eventType])
        return

    Object.keys(subscriptions[eventType]).forEach(key => subscriptions[eventType][key](arg))
}