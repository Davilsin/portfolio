// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Please login first.' });
};

// Check if user is superadmin
const isSuperAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'superadmin') {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden. Superadmin access required.' });
};

module.exports = {
    isAuthenticated,
    isSuperAdmin
};
