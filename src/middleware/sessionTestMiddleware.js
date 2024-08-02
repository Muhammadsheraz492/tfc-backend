export const sessionTestMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        req.userId=req.session.user._id
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }
};


