export const localsMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        res.locals.loggedIn = true
    }
    res.locals.siteName = "Wetube"
    res.locals.loggedInUser = req.session.user;
    next();
};