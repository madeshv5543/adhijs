const Jsonrpc = require('../utils/jsonrpc');
const Utils = require('../utils/utils');
const RequestManger = function (provider) {
    this.provider = provider;
    this.polls = {};
    this.timeout = null;
}

RequestManger.prototype.send = function(data){
    if(!this.provider) {
        console.log('No provider available');
        return null;
        //throw error
    }
    let payload = Jsonrpc.toPayload(data.method, data.params)
    let result = this.provider.send(payload);
    if(!Jsonrpc.isValidResponse(result)) {
        console.log("invalid response")
    }
    return result.result;
}

RequestManger.prototype.sendAsync = function(data, cb) {
    if(!this.provider) {
       return cb('invalid request')
    }
    let payload = Jsonrpc.toPayload(data.method, data.params);
    this.provider.sendAsync(payload, (err, res) => {
        if(err) {
            return cb(err)
        }
        if(!Jsonrpc.isValidResponse(res)){
           return cb('invalid response')
        }
        cb(null, res.result)
    });
}

RequestManger.prototype.sendBatch = function(data, cb) {
    if(!this.provider) {
       return cb('No provider available')
    }
     let payload = Jsonrpc.toBatchPayload(data)
     this.provider.sendAsync(payload, function(err, res) {
        if(err) {
          return  cb(err)
        }

        if(!Utils.isArray(res)) {
          return  cb('invalid response')
        }

        cb(err, res.result)

     })
}