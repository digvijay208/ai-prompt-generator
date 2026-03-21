const { GoogleGenAI } = require('@google/genai');
const genAI = new GoogleGenAI({ apiKey: 'REDACTED_API_KEY' });

async function test() {
  try {
    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [{ parts: [{ text: 'Hello' }] }]
    });
    console.log('RESULT STRUCTURE:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('TEST FAILED:', e.message);
  }
}
test();
