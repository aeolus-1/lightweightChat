require('dotenv').config()


function auth(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error("You are not authenticated");

        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        next(err);
    }

    var auth = new Buffer(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");
    var username = auth[0];
    var password = auth[1];
    console.log(username,password)
    if (username == process.env.auth_user && password == process.env.auth_pass) {
        next();
    } else {
        var err = new Error("You are not authenticated");
        console.log("failed login")
        
        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        next(err);
    }
}

module.exports = auth;
