import { NextResponse } from 'next/server';
import { generateAIPrompt } from '@/lib/gemini';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { userInput, options } = await req.json();
    
    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    const output = await generateAIPrompt(userInput, options);
    
    return NextResponse.json({ prompt: output });
  } catch (error: any) {
    console.error('--- API ERROR ---', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
