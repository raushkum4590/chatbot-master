# Gemini Voice Recognition Implementation

This implementation uses Google's Gemini AI to process audio data for speech recognition in your chatbot application. Here's how it works:

## Architecture

1. **Frontend Component**: `ChatInputGemini.tsx`
   - Uses the `useGeminiSpeech` hook to manage audio recording
   - Provides visual feedback during recording and processing
   - Displays transcribed text in the chat input

2. **Speech Hook**: `useGeminiSpeech.ts`
   - Manages audio recording using the browser's MediaRecorder API
   - Sends the recorded audio to the backend API
   - Receives transcribed text from the API

3. **Backend API**: `/api/speech/route.ts`
   - Receives audio data from the frontend
   - Uses Gemini AI to process the audio and generate a transcript
   - Returns the transcribed text to the frontend

## Important Notes

1. **Browser Support**:
   - Requires a modern browser with MediaRecorder API support
   - Requires microphone permissions
   - Only works in secure contexts (HTTPS or localhost)

2. **API Keys**:
   - Requires a valid Gemini API key in your environment variables
   - Set `GEMINI_API_KEY` in your `.env.local` file

3. **Speech Recognition Limitations**:
   - Gemini currently doesn't directly support audio input (as of May 2025)
   - This implementation uses a simulated response
   - In a production environment, you would need to use Google's Speech-to-Text API
   - You can integrate more advanced voice recognition using Google Cloud Speech-to-Text

4. **Integration with Chatbot**:
   - Update `Chatbot.tsx` to import and use `ChatInputGemini` instead of the regular `ChatInput`
   - All other functionality remains the same

## Future Improvements

1. Integrate Google Cloud Speech-to-Text API for accurate audio transcription
2. Add language selection for multilingual support
3. Implement streaming speech recognition for real-time feedback
4. Add voice commands for common actions (clear, send, etc.)
5. Add speech output for a complete voice interface

## Usage

Modify the Chatbot component to use the Gemini-powered input:

```tsx
import ChatInputGemini from "./ChatInputGemini";

// Replace regular ChatInput with ChatInputGemini
<ChatInputGemini onSendMessage={handleSendMessage} disabled={loading} />
```

## Troubleshooting

- If voice recognition is not working, check browser console for errors
- Ensure you have a valid Gemini API key
- Verify that your browser supports MediaRecorder API
- Check that microphone permissions are granted

## Vercel Deployment

When deploying to Vercel, speech recognition requires additional configuration:

1. **Environment Variables**:
   - Add `GEMINI_API_KEY` to your Vercel project's environment variables
   - Make sure to use production API keys, not development ones

2. **Headers Configuration**:
   - The project includes a `vercel.json` file with the necessary CORS headers
   - These headers are required for speech recognition to work in a browser

3. **Browser Compatibility**:
   - Speech recognition on Vercel only works in compatible browsers (Chrome, Edge, Safari)
   - Must be accessed via HTTPS (Vercel provides this by default)
   - Users must grant microphone permissions

4. **Troubleshooting Vercel Deployment**:
   - If speech recognition fails on Vercel but works locally, check browser console for CORS errors
   - Verify that your API keys are properly set in Vercel's environment settings
   - Run a diagnostic test by visiting `/speech-test` on your deployed site
   - Make sure you're using a secure (HTTPS) connection
   - Try different browsers (Chrome or Edge recommended)
