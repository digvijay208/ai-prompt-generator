const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('REDACTED_API_KEY');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Write a short greeting.');
    const response = await result.response;
    const text = response.text();
    console.log('SUCCESS!');
    console.log('TEXT:', text);
  } catch (e) {
    console.error('FAILED!');
    console.error('Message:', e.message);
  }
}
test();
