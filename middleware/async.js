//Abstracted try-catch block and removed it from the route handler by creating a function
//That returns a route handler function and passes in req, res, and next. Express expects a route
//handler to return a function that express can then be responsible for invoking.
// GET api/genres handler === async (req, res, next ) => {
//     const genres = await Genre.find().sort({name: 1});
//     res.send(genres);
// }

module.exports = function(handler) {
    //return standard express route handler
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(ex) {
            next(ex)
        }
    };
};
