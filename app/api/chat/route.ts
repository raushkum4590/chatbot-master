import { generateResponse } from "@/app/utils/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    const response = await generateResponse(message);
    return NextResponse.json({ response });  } catch (error: any) {
    console.error("API error:", error);
    
    // Check for API key related errors
    if (error?.toString().includes("API key expired") || error?.toString().includes("API_KEY_INVALID")) {
      return NextResponse.json(
        { 
          response: "API key has expired. Please update the GEMINI_API_KEY in your .env file with a valid key from Google AI Studio.",
          error: "API_KEY_EXPIRED"
        }, 
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { response: "I'm sorry, I encountered an error. Please try again later." }, 
      { status: 500 }
    );
  }
}
