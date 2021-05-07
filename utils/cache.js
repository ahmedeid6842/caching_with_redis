const { json } = require("express");
const mongoose = require("mongoose");
const redis = require("redis")
const util = require("util");

// TODO: connect to  redis 
let client = redis.createClient("redis://localhost:6379")

// TODO: save a refernce copy from exec()
const exec = mongoose.Query.prototype.exec;


// TODO: convert function callback to promise util.promisify
//promisify is util function that overwrite function that return callback to return promise

client.hget = util.promisify(client.hget);


// TODO: add cache function and when we call it the cache logic we add will execute

mongoose.Query.prototype.cache = function (option = {}) {
    this.useCache = true;//set flag when it set means use caching

    this.hashKey = JSON.stringify(option.key || ''); // set the key of the hash map that belongs to specifi user

    return this;//returing this to enable chaning ,,, cache().limit(10)....
}

// TODO: overwrite to exec function from match you cases with redis
mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }

    // TODO: key={query+collectionName} ... to get query executed getQuery() collectionName mongooseCollection.name 
    // TODO: convert object to json use json.stringfy
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    )

    // TODO: see if we have a value with our key in redis
    let cachedValue = await client.hget(this.hashKey, key);

    // TODO: if do ,,, return that 
    if (cachedValue) {
        cachedValue = JSON.parse(cachedValue);
        console.log("from cache");
        return Array.isArray(cachedValue) ?
            cachedValue.map(value => new this.model(value))
            : new this.model(JSON.parse(cachedValue));
    }

    // TODO: if not ,,, issue the query and store the result in redis,,, apply(this,arguments) 
    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 60);
    console.log("from mongodb");

    return result;
}

const clearHash = function (hashKey) {
    client.del(JSON.stringify(hashKey))
}
module.exports = {
    clearHash
}