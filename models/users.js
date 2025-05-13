const { db } = require('./db_base');
const bcrypt = require('bcrypt');

// Create users table if it doesn't exist
const initUsersTable = () => {
    const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    try {
        db.exec(createTable);
        return true;
    } catch (error) {
        console.error('Error creating users table:', error);
        return false;
    }
};

// Check if a user exists by username
const getUserByUsername = async (username) => {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    try {
        return await stmt.get(username);
    } catch (error) {
        console.error('Error finding user:', error);
        return false;
    }
};

// Register a new user
const registerUser = async ({ username, password }) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    try {
        return await stmt.run(username, hashedPassword);
    } catch (error) {
        console.error('Error registering user:', error);
        return false;
    }
};

// Validate user credentials
const validateUser = async ({ username, password }) => {
    const user = await getUserByUsername(username);
    
    if (!user) {
        return false;
    }
    
    // Compare the password with the hashed password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
        return user;
    }
    
    return false;
};

module.exports = {
    initUsersTable,
    getUserByUsername,
    registerUser,
    validateUser
};