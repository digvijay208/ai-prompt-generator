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

function saveUsers(users: any[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const users = loadUsers();
        if (users.find((u: any) => u.email === email)) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { id: Date.now(), email, password: hashedPassword };       
        users.push(user);
        saveUsers(users);

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '24h' });
        
        return NextResponse.json({ token, userId: user.id, message: 'Account created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Server error: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}
