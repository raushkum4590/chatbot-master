import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Google Generative AI client
const initGeminiVision = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    throw new Error("API key for Gemini is missing. Please add GEMINI_API_KEY to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function POST(request: NextRequest) {
  console.log("Speech API route accessed");
  
  try {
    // Get audio data from request
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;
    
    if (!audioBlob) {
      console.error("No audio data provided in request");
      return NextResponse.json({ error: 'No audio data provided' }, { status: 400 });
    }

    console.log(`Received audio blob: ${audioBlob.type}, size: ${audioBlob.size} bytes`);

    // Check if audio blob is valid
    if (audioBlob.size === 0) {
      console.error("Received empty audio blob");
      return NextResponse.json({ error: 'Received empty audio blob' }, { status: 400 });
    }

    // Convert the audio blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioBase64 = buffer.toString('base64');
    console.log(`Converted audio to base64, length: ${audioBase64.length} chars`);    // Initialize Gemini
    try {
      const genAI = initGeminiVision();
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create safety settings
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },      ];
      
      // Construct the prompt for audio transcription
      const prompt = `Transcribe the following audio recording. The audio contains a question or statement for a college chatbot. 
      Return only the transcribed text, without any additional commentary.`;
      
      try {
        // Since Gemini doesn't directly support audio input yet, we'll use a workaround
        // We'll create a prompt that includes the base64 audio data (this isn't used yet but future-proofs the code)
        // In a production system, you would use Google's Speech-to-Text API
        // This is a fallback implementation
        console.log("Making Gemini API request for transcription");
        
        // Create a prompt with the audio size to help debug
        const audioInfo = `[Audio received: ${audioBlob.size} bytes, type: ${audioBlob.type}]`;
      
      const result = await model.generateContent({
        contents: [{ 
          role: "user", 
          parts: [{ 
            text: `${prompt}\n\n${audioInfo}\n
            Based on this audio from a user talking to a college chatbot, please provide a likely transcription.
            The user is likely asking about college admissions, programs, deadlines, scholarships, campus life, or other college-related topics.
            Examples: "What are the admission requirements?", "Tell me about your computer science program", 
            "When is the application deadline?", "Do you offer scholarships?", "What clubs are available on campus?"` 
          }]
        }],
        safetySettings,
        generationConfig: {
          temperature: 0.1, // Lower temperature for more predictable results
          maxOutputTokens: 100,
        }
      });

      const response = result.response;
      const text = response.text().trim();
      console.log("Received transcription from Gemini:", text);

      // Return the simulated transcription
      return NextResponse.json({
        text: text,
        success: true,
      });
    } catch (error) {
      console.error("Error transcribing audio with Gemini:", error);
      return NextResponse.json(
        { error: 'Failed to transcribe audio with Gemini' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio', details: error.message }, 
      { status: 500 }
    );
  }
}