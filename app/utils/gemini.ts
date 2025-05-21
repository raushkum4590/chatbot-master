import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
export const initGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    throw new Error("API key for Gemini is missing. Please add GEMINI_API_KEY to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate a response using Gemini
export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const genAI = initGemini();
    // Changed to use the standard gemini-2.0-flash model for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    
    const graceCollegeInfo = `
Grace College of Engineering (https://grace.edu.in/) is an educational institution in Tamil Nadu, India.

Key Information:
- Location: Thoothukudi district, Tamil Nadu, India
- Established: The institute was established to provide quality technical education to students
- Vision: To be a premier technical institution through excellence in education and research
- Mission: To impart quality technical education with ethical values and prepare students for industry needs
- Accreditation: Accredited by the All India Council for Technical Education (AICTE)

Academic Programs:
- B.E. in Computer Science and Engineering
- B.E. in Mechanical Engineering
- B.E. in Electrical and Electronics Engineering
- B.E. in Electronics and Communication Engineering
- B.E. in Civil Engineering

Facilities:
- Modern laboratories and research facilities
- Library with extensive technical resources
- Computer labs with high-speed internet
- Sports facilities and gymnasium
- Separate hostels for boys and girls
- Transportation facilities for students

Student Activities:
- Technical symposiums and workshops
- Cultural events and festivals
- Sports tournaments
- Industry visits and internships
- Placement training programs

Admission Process:
- Admissions are based on state-level engineering entrance exams
- Lateral entry is available for diploma holders
- Management quota seats are also available

Placements:
- Dedicated training and placement cell
- Collaborations with various industries
- Pre-placement training programs
- Regular campus recruitment drives
`;
    
    const graceContextPrompt = `You are the AI assistant for Grace College of Engineering in Tamil Nadu, India.
      Provide helpful, accurate information about the college's programs, admissions, faculty, 
      and facilities. Use the following information about Grace College in your responses:
      
      ${graceCollegeInfo}
      
      If you don't know something specific about Grace College beyond what's provided, acknowledge that
      you don't have that specific information but offer to help with general engineering education questions.
      Be friendly, professional and concise in your responses.
      
      User question: ${prompt}`;
    
    const result = await model.generateContent(graceContextPrompt);
    const response = result.response;
    return response.text();  } catch (error: any) {
    console.error("Error generating response:", error);
    
    const errorMsg = error?.toString() || '';
    
    // Check for API key issues
    if (errorMsg.includes("API key expired") || 
        errorMsg.includes("API_KEY_INVALID")) {
      return "API key has expired. Please update the GEMINI_API_KEY in your .env file with a valid key from Google AI Studio.";
    }
    
    // Check for model issues
    if (errorMsg.includes("model not found") ||
        errorMsg.includes("Model not found")) {
      return "The selected Gemini model is not available. Please update the model name in the code to a currently available Gemini model.";
    }
    
    return "I'm sorry, I encountered an error. Please try again later.";
  }
};