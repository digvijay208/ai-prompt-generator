const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI("REDACTED_API_KEY");
  
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hi");
      console.log(`${m}: SUCCESS`);
    } catch (e) {
      console.log(`${m}: FAILED - ${e.message}`);
    }
  }
}

listModels();
