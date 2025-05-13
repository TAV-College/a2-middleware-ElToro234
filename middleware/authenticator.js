const jwt = require('jsonwebtoken');

// Secret key for JWT signing and to use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generateToken = (user) => {
    // Token expires in 24 hours
    return jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const verifyToken = (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add the user info to the request object
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = {
    generateToken,
    verifyToken
};