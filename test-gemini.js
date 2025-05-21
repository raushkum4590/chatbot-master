// test-gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable (recommended)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not defined. Please set it and try again.');
  process.exit(1);
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    // For text-only input, use the gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = 'Write a short greeting for a college chatbot.';
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('API test successful!');
    console.log('Response:', text);
  } catch (error) {
    console.error('API test failed:', error.message);
    console.error(error);
  }
}

testGemini();
