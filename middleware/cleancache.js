const { clearHash } = require("../utils/cache")

module.exports= async (req, res, next) => {
    await next();
    clearHash(req.body.userId);
}