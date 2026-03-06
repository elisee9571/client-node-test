exports.checkAuth = (req, res, next) => {
    if (req.session && req.session.accessToken) {
        return next();
    }

    // mémorise la page demandée
    delete req.session.accessToken;
    delete req.session.userId;
    delete req.session.returnTo;

    req.session.returnTo = req.originalUrl;

    return res.redirect("/login");
};
