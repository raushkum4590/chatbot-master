# College Chatbot with Speech Recognition

This is an AI-powered chatbot for Grace College with speech recognition capabilities. Users can type questions or use voice input to interact with the chatbot.

## Features

- ✅ AI-powered chat responses
- ✅ Speech recognition (voice-to-text)
- ✅ Responsive UI for all devices
- ✅ Suggested questions
- ✅ Dark/light mode

## Speech Recognition Features

This chatbot supports two speech recognition implementations:

1. **Web Speech API** (default): Uses the browser's built-in speech recognition
2. **Gemini API**: Uses Google's Gemini AI for audio processing (experimental)

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/college-chatbot.git
cd college-chatbot
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Speech Recognition Support

Speech recognition requires:
- A modern browser (Chrome, Edge, or Safari recommended)
- A secure context (HTTPS or localhost)
- Microphone permissions

To test speech recognition capabilities, visit:
- `/speech-test` - Simple test of speech recognition
- `/speech-diagnostics` - Detailed diagnostics for troubleshooting

## Deployment on Vercel

1. Create a Vercel account and connect your repository
2. Set the following environment variables:
   - `GEMINI_API_KEY` - Your Gemini API key
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Same key (for client-side usage)
3. Deploy the project
4. Speech recognition requires CORS headers, which are provided in `vercel.json`

## Troubleshooting

If you encounter issues with speech recognition:

- Check that your browser supports the Web Speech API
- Ensure you're using a secure connection (https:// or localhost)
- Grant microphone permissions when prompted
- See `SPEECH_RECOGNITION_HELP.md` for detailed troubleshooting
- For Vercel deployment issues, see `SPEECH_RECOGNITION_VERCEL.md`

## Windows Build Issues

If you encounter permission errors when building on Windows, see `WINDOWS_BUILD_TROUBLESHOOTING.md` for solutions.

## Documentation

- `GEMINI_VOICE_RECOGNITION.md` - Details on the Gemini API implementation
- `SETUP_API_KEY.md` - Guide for obtaining and setting up API keys
- `VERCEL_DEPLOYMENT.md` - Detailed Vercel deployment instructions

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Web Speech API
- Google Gemini AI
- Framer Motion

## License

This project is licensed under the MIT License.
