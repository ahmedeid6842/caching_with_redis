const redis = require("redis")

let _db;
const initDB = callback => {
    if (_db) {
        console.log("redis database is already connected");
        return (null, _db);
    }
    let client = redis.createClient("redis://localhost:6379")

    client.on("connect", function (err) {
        if (err) return callback(err);
        _db = client;
        callback(null, _db);
    })
}

const getDB = () => {
    if (!_db) {
        throw Error("DataBase not intialized")
    }
    return _db;
}

module.exports = {
    initDB,
    getDB
}