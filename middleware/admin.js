
module.exports = function(req, res, next) {
    //req.user
    // 401 unauthorized
    // 403 forbidden
    if (!req.user.isAdmin) return res.status(403).send("Access denied.");
    next()
};
