import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const USERS_FILE = path.join(process.cwd(), 'users.json');

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return [];
        }
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const users = loadUsers();
        const user = users.find((u: any) => u.email === email);

        if (!user || !await bcrypt.compare(password, user.password)) {
            return NextResponse.json({ message: 'Invalid credentials. Please create an account.' }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '24h' });
        
        return NextResponse.json({ token, userId: user.id, message: 'Logged in successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
