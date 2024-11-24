import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyB8Eqwur4veZJM13d-R_QUlahaOsp9HOFQ";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function formatData(prompt) {
  try {
    const response = await model.generateContent(prompt);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}
