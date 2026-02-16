const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

const app = express();
app.use(express.json());
app.use(express.static('.'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/promptgen', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
});

// User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Prompt history schema
const promptHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    metadata: {
        purpose: String,
        subject: String,
        details: String
    },
    preview: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const PromptHistory = mongoose.model('PromptHistory', promptHistorySchema);

// Test MongoDB connection
app.get('/api/test-db', async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.json({ message: 'MongoDB connected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'MongoDB connection failed', error: error.message });
    }
});

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: 'User already exists' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Save prompt to history
app.post('/api/save-prompt', verifyToken, async (req, res) => {
    try {
        const { prompt, metadata, preview } = req.body;
        
        const promptHistory = new PromptHistory({
            userId: req.userId,
            prompt,
            metadata,
            preview
        });
        
        await promptHistory.save();
        
        // Keep only last 50 prompts per user
        const userPrompts = await PromptHistory.find({ userId: req.userId })
            .sort({ timestamp: -1 })
            .skip(50);
        
        if (userPrompts.length > 0) {
            await PromptHistory.deleteMany({ 
                _id: { $in: userPrompts.map(p => p._id) } 
            });
        }
        
        res.json({ message: 'Prompt saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving prompt' });
    }
});

// Get prompt history
app.get('/api/prompt-history', verifyToken, async (req, res) => {
    try {
        const history = await PromptHistory.find({ userId: req.userId })
            .sort({ timestamp: -1 })
            .limit(50);
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
});

// Delete prompt from history
app.delete('/api/prompt-history/:id', verifyToken, async (req, res) => {
    try {
        await PromptHistory.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        res.json({ message: 'Prompt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prompt' });
    }
});

// Admin middleware
const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin routes
app.get('/api/admin/verify', verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: 'Admin verified' });
});

app.get('/api/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPrompts = await PromptHistory.countDocuments();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const promptsToday = await PromptHistory.countDocuments({
            timestamp: { $gte: today }
        });
        
        const activeUserIds = await PromptHistory.distinct('userId', {
            timestamp: { $gte: today }
        });
        
        res.json({
            totalUsers,
            totalPrompts,
            activeToday: activeUserIds.length,
            promptsToday
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const usersWithActivity = await Promise.all(users.map(async (user) => {
            const promptCount = await PromptHistory.countDocuments({ userId: user._id });
            const lastPrompt = await PromptHistory.findOne({ userId: user._id }).sort({ timestamp: -1 });
            
            return {
                email: user.email,
                createdAt: user.createdAt,
                promptCount,
                lastActivity: lastPrompt?.timestamp
            };
        }));
        
        res.json(usersWithActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/admin/activity', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const activities = await PromptHistory.find()
            .sort({ timestamp: -1 })
            .limit(50)
            .populate('userId', 'email');
        
        const formattedActivities = activities.map(a => ({
            userEmail: a.userId?.email || 'Unknown',
            preview: a.preview,
            timestamp: a.timestamp
        }));
        
        res.json(formattedActivities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity' });
    }
});

// Refine prompt using Gemini AI
app.post('/api/refine-prompt', verifyToken, async (req, res) => {
    try {
        const { userPrompt } = req.body;
        
        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_gemini_api_key_here') {
            return res.status(400).json({ message: 'Gemini API key not configured' });
        }
        
        const refinementPrompt = `You are an expert prompt engineer. Refine and improve the following prompt to make it more effective, clear, and likely to produce high-quality results from AI models. Keep the core intent but enhance clarity, structure, and specificity.

Original prompt:
${userPrompt}

Provide only the refined prompt without any explanations or meta-commentary.`;
        
        console.log('\n--- BEFORE REFINEMENT ---');
        console.log(userPrompt);
        
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ parts: [{ text: refinementPrompt }] }]
        });
        
        const refinedPrompt = result.response.text();
        
        console.log('\n--- AFTER REFINEMENT ---');
        console.log(refinedPrompt);
        console.log('\n------------------------\n');
        
        res.json({ refinedPrompt });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ message: 'Error refining prompt', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
});