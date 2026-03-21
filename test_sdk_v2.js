const genai = require('@google/genai');
console.log('All exports:', Object.keys(genai).filter(k => k.toLowerCase().includes('genai') || k.toLowerCase().includes('gemini') || k.toLowerCase().includes('model')));
