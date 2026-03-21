const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  try {
    // The SDK doesn't have a direct listModels, but we can try a basic generate with a known model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Gemini 1.5 Flash: SUCCESS");
  } catch (e) {
    console.log("Gemini 1.5 Flash: FAILED", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hi");
    console.log("Gemini Pro: SUCCESS");
  } catch (e) {
    console.log("Gemini Pro: FAILED", e.message);
  }
}

listModels();
