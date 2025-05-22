# Speech Recognition Troubleshooting Guide

If you're having issues with the speech recognition feature in our chatbot, follow this guide to diagnose and fix the problem.

## Common Issues and Solutions

### 1. Browser Compatibility

The Web Speech API is not supported in all browsers. For best results:

- **Recommended browsers**: Chrome, Edge, or Safari
- **Not recommended**: Firefox (limited support), Internet Explorer (no support)

**Test your browser**: Visit `/speech-test` in our application to check if your browser supports speech recognition.

### 2. Microphone Access

Speech recognition requires microphone access:

- Make sure you've granted microphone permission when prompted
- Check your browser settings to ensure the site has microphone access
- Try speaking clearly and directly into your microphone

### 3. Speech Recognition Quality

For better recognition results:

- Speak clearly and at a moderate pace
- Use simple, complete sentences
- Minimize background noise
- Position yourself closer to the microphone
- Try using headphones with a built-in microphone

### 4. Network Issues

Speech recognition may be affected by:

- Slow or unstable internet connection
- Firewalls or network restrictions

### 5. Using the Test Page

We've created a dedicated test page to help diagnose issues:

1. Go to `/speech-test` in the application
2. Click "Start Listening" and speak a test phrase
3. Check the results to see if your speech is being recognized
4. View the test logs for any error messages

### 6. Manual Fallback

If speech recognition is not working:

- Use the text input to type your questions instead
- Try the "GPA" test button to quickly insert a sample question

## Technical Requirements

- Modern browser (Chrome, Edge, or Safari recommended)
- Microphone access permitted
- Stable internet connection
- HTTPS connection (required for speech recognition)

If you continue to experience issues after following these steps, please contact support.
