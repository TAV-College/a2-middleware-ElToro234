const router = require('express').Router();
const { registerUser, validateUser, initUsersTable } = require('../models/users');
const { generateToken } = require('../middleware/auth');

// Initialize users table
initUsersTable();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    
    try {
        const result = await registerUser({ username, password });
        
        if (result) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(400).json({ message: 'Username already exists' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login and generate token
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    
    try {
        const user = await validateUser({ username, password });
        
        if (user) {
            // Generate token
            const token = generateToken(user);
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

module.exports = router;