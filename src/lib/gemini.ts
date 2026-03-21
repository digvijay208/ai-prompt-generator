import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

// A mapping of purposes to expert personas to ground the AI's understanding
const roleMap: Record<string, string> = {
  "Answer a question": "You are a deeply analytical Subject Matter Expert and renowned researcher.",
  "Generate content": "You are a master Copywriter and Content Strategist who understands human psychology.",
  "Analyze data": "You are a Senior Data Scientist and Systems Analyst.",
  "Summarize text": "You are an Executive Editor who excels at extracting high-signal signal from noise.",
  "Translate text": "You are an Expert Linguist and Cultural Localization specialist.",
  "Write code": "You are a Staff-Level Software Architect and Principal Engineer who provides production-ready code.",
  "Creative writing": "You are a New York Times Bestselling Author and master storyteller.",
  "Image generation": "You are a world-class prompt engineer for Midjourney and Stable Diffusion, possessing deep knowledge of photography, lighting, and art history.",
  "Video generation": "You are an Academy Award-winning Cinematographer and Director of Photography specializing in AI video synthesis (Sora, Runway, Veo).",
  "3D model": "You are a Master 3D Artist and Technical Director, specializing in generative 3D modeling, topology, texturing, and spatial prompt engineering."
};

export async function generateAIPrompt(userInput: string, options: any) {
  const dynamicRole = roleMap[options.purpose] || "You are an elite, world-class Prompt Engineer and AI Whisperer.";
  
  let taskDirectives = "";
  let finalFormat = options.format;

  if (options.purpose === "Write code") {
    // Override the format if it conflicts with writing code
    if (finalFormat === "Paragraph") finalFormat = "Clean Code with comments";
    
    taskDirectives = "\n  CRITICAL CODE DIRECTIVE: The user wants to GENERATE ACTUAL RUNNABLE CODE. You MUST engineer a prompt that explicitly commands the target AI to write code, provide implementation, or generate a script. DO NOT engineer a prompt that asks for a theoretical explanation, architecture paragraph, or summary.";
  } else if (["Image generation", "Video generation", "3D model"].includes(options.purpose)) {
    taskDirectives = "\n  CRITICAL VISUAL DIRECTIVE: Engineer a prompt optimized for diffusion models. Focus heavily on visual descriptors, lighting, camera angles, and atmosphere.";
  }

  const prompt = `${dynamicRole}

  Your task is to take the user's intent and engineer the ultimate, highly-optimized prompt that they can copy/paste into an LLM or AI generator to get the best possible result. Use advanced prompt engineering frameworks (like providing context, clear instructions, output formats, and constraints).

  USER INTENT / SUBJECT: ${options.subject || userInput}
  SPECIFIC CONSTRAINTS / DETAILS: ${options.details || 'None provided'}
  DESIRED TONE: ${options.tone}
  DESIRED OUTPUT FORMAT: ${finalFormat}${taskDirectives}

  ADDITIONAL REQUIREMENTS:
  ${options.includeExamples ? "- Ensure the final prompt instructs the AI to include 2-3 illustrative examples." : ""}
  ${options.stepByStep ? "- Ensure the final prompt instructs the AI to provide a step-by-step breakdown or use Chain-of-Thought reasoning." : ""}
  ${options.citeSources ? "- Ensure the final prompt instructs the AI to cite relevant frameworks or sources." : ""}

  CRITICAL INSTRUCTION: Return ONLY the final optimized prompt text, ready to be copied and pasted. Do not include any meta-commentary, markdown wrapping like "Here is your prompt:", or introductory/concluding remarks. Simply output the prompt itself.`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return (result as any).text || (result as any).response?.text?.() || (result as any).response?.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
