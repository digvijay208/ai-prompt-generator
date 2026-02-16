const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const USERS_FILE = '/tmp/users.json';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

function getUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }
    } catch (e) {}
    return [];
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        const users = getUsers();
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers(users);
        
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
