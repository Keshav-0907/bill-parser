import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyB8Eqwur4veZJM13d-R_QUlahaOsp9HOFQ');

export async function POST(req: NextRequest) {
    console.log('here', req);
    try {
        const formData = await req.formData();
        const imageFile = formData.get("image") as File;
        
        if (!imageFile) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Convert the image to bytes
        const imageBytes = await imageFile.arrayBuffer();

        console.log('first 10 bytes:', new Uint8Array(imageBytes).slice(0, 10));

        // Initialize the Gemini Pro Vision model
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        // Prepare the image for Gemini
        const prompt = "Describe the image";
        const imageData = {
            inlineData: {
                data: Buffer.from(imageBytes).toString('base64'),
                mimeType: imageFile.type
            },
        };

        // Generate content
        const result = await model.generateContent([prompt, imageData]);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            description: text
        });

    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        );
    }
}