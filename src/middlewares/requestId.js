const { v4: uuid4 } = require("uuid");

function requestIdMiddleware(req,res,next) {
    const requestId = req.headers["x-request-id"] || uuid4();

    req.requestId = requestId;

    res.setHeader("X-Request-ID", requestId);

    next();
}

module.exports = requestIdMiddleware