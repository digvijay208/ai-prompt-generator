const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/promptgen', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    const email = 'admin@admin.com';
    const password = 'admin123';
    
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            existing.isAdmin = true;
            await existing.save();
            console.log('✅ Existing user upgraded to admin');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ email, password: hashedPassword, isAdmin: true });
            console.log('✅ Admin created successfully');
        }
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
