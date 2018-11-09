var Jsonrpc = {
    messageId = 0,
    toPayload,
    isValidResponse,
    toBatchPayload
}

let toPayload = function(method, params) {
    if(!method) {
        console.log("method name should not be empty")
        //throw error
    }
    Jsonrpc.messageId++;
    return {
        jsonrpc: '2.0',
        id:Jsonrpc.messageId,
        method: method,
        params:params || []
    }
}

let isValidResponse = function(res) {
    return Array.isArray(res) ? res.every() : validateMessage(res)
    function validateMessage (msg) {
        return !!msg && !msg.error && msg.jsonrpc === '2.0' &&  typeof msg.id === 'number' && msg.result !== undefined;
    }
}

let toBatchPayload = function(msgs) {
    return msgs.map( msg => {
        return Jsonrpc.toPayload(msg.method, msg.params)
    })
}

module.exports= Jsonrpc;