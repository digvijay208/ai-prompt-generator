import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return NextResponse.json({ message: 'Invalid credentials. Please create an account.' }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id.toString() }, 
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '24h' }
        );

        return NextResponse.json(
            { token, userId: user._id.toString(), message: 'Logged in successfully' }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('Login Error:', error);
    }
}
