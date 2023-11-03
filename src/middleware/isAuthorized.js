function isAuthorized(opts) {
    return (req, res, next) => {
        const { role, email, uid } = res.locals;
        const { id } = req.params;
        if (opts.allowSameUser && id && uid === id) {
            return next();
        }

        if (!role) {
            return res.status(403).send({ message: 'Not Have Role' });
        }

        if (opts.hasRole.includes(role)) {
            return next();
        }
        return res.status(403).send({ message: 'Not Authorized' });
    };
}

export default isAuthorized;
