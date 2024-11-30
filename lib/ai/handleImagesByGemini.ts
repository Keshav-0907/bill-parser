import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey = "AIzaSyB8Eqwur4veZJM13d-R_QUlahaOsp9HOFQ";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function handleGeminiImages(base64Data) {
  try {
    if (!base64Data) {
      throw new Error("No base64 data provided");
    }

    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Clean, 'base64');

    // Detect mime type from base64 header
    const mimeType = detectMimeType(base64Data);

    // Upload the file to Gemini
    const uploadResult = await fileManager.uploadFile(buffer, {
      mimeType: mimeType,
      displayName: `image_${Date.now()}.${mimeType.split('/')[1]}`,
    });

    if (!uploadResult.file) {
      throw new Error("File upload failed");
    }

    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.name}`);

    // Generate content from the uploaded image
    const result = await model.generateContent(
      [uploadResult.file],
      generationConfig
    );

    const response = await result.response;
    return response;

  } catch (error) {
    console.error("Error in handleGeminiImages:", error);
    throw error;
  }
}

// Helper function to detect mime type from base64 data
function detectMimeType(base64Data) {
  const signatures = {
    '/9j/': 'image/jpeg',
    'iVBORw0KGgo': 'image/png',
    'R0lGOD': 'image/gif',
    'UklGR': 'image/webp'
  };

  for (const [signature, mimeType] of Object.entries(signatures)) {
    if (base64Data.includes(signature)) {
      return mimeType;
    }
  }

  return 'image/jpeg'; // Default to JPEG if unknown
}