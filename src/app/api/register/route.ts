import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Connect to MongoDB
        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password and store in database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, name });       

        // Sign JWT using MongoDB's auto-generated `_id`
        const token = jwt.sign(
            { userId: newUser._id.toString() }, 
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '24h' }
        );
        
        return NextResponse.json(
            { token, userId: newUser._id.toString(), message: 'Account created successfully' }, 
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Server error: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}
