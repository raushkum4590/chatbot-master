# Speech Recognition on Vercel

This guide provides detailed instructions for ensuring speech recognition works properly when deployed to Vercel.

## Pre-Deployment Checklist

1. **Environment Variables**
   - [ ] GEMINI_API_KEY is configured in Vercel project settings
   - [ ] NEXT_PUBLIC_GEMINI_API_KEY is configured in Vercel project settings (if used client-side)

2. **Required Files**
   - [ ] `vercel.json` is present with correct CORS headers
   - [ ] `next.config.js` has proper configuration for headers

3. **TypeScript Configuration**
   - [ ] `tsconfig.json` is configured to handle type errors gracefully

## Testing Speech Recognition on Vercel

1. **Visit the Speech Test Page**
   - Navigate to `https://your-vercel-domain.vercel.app/speech-test`
   - This page will run diagnostics on your browser's speech recognition capabilities

2. **Check Browser Compatibility**
   - Speech recognition works best on:
     - Google Chrome (desktop)
     - Microsoft Edge (desktop)
     - Safari (desktop and iOS)
   - Less compatible with:
     - Firefox (partial support)
     - Older browsers

3. **Verify CORS Headers**
   - Open browser developer tools (F12)
   - Go to the Network tab
   - Test speech recognition
   - Check that responses include:
     - `Cross-Origin-Opener-Policy: same-origin`
     - `Cross-Origin-Embedder-Policy: require-corp`

## Common Vercel Deployment Issues

### 1. Missing CORS Headers

**Symptoms:**
- Speech recognition works locally but fails on Vercel
- Console shows CORS-related errors

**Solution:**
Ensure your `vercel.json` includes:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

### 2. API Key Issues

**Symptoms:**
- Console shows "API key is missing" or authentication errors
- Speech recognition never completes processing

**Solution:**
- Verify your Gemini API key is correctly set in Vercel project settings
- Check that your key has not expired
- Ensure the API key has the correct permissions

### 3. Build Errors

**Symptoms:**
- Deployment fails with TypeScript errors
- Speech recognition code is not included in the build

**Solution:**
- Use the `build:vercel` script in package.json
- Set `ignoreBuildErrors: true` in next.config.js

### 4. Microphone Permissions

**Symptoms:**
- "Listening..." never appears
- No transcription occurs

**Solution:**
- Ensure your site is accessed via HTTPS (Vercel provides this)
- Check browser permissions for microphone access
- Guide users to click "Allow" when prompted

## Server-Side Logging

To help diagnose issues, we've added enhanced logging:

1. **Client-Side Logs**
   - Browser information is logged when speech recognition is initialized
   - Transcript processing status is logged to console

2. **Server-Side Logs**
   - API route logs requests, audio details, and processing status
   - Error details are captured for debugging

These logs can be viewed in the Vercel deployment logs under "Functions" in your project dashboard.

## Advanced Troubleshooting

If speech recognition still doesn't work:

1. **Try Disabling Enhanced Speech Settings**
   - Some advanced options (continuous listening, interim results) may not work on all browsers
   - Set `continuous: false` and `interimResults: false` for better compatibility

2. **Check for Ad Blockers or Privacy Extensions**
   - Some browser extensions can block speech recognition
   - Test in incognito mode or with extensions disabled

3. **Verify Browser Audio Processing**
   - Try other sites that use speech recognition (like Google Dictation)
   - If those work but your app doesn't, it's likely a code-specific issue

4. **Fallback to Traditional Input**
   - Provide clear text input alternatives for users who can't use speech
   - Consider adding a toggle to disable speech features

## Need Help?

If you've tried everything and speech recognition still doesn't work on Vercel:

1. Go to the site on a Chrome desktop browser
2. Navigate to the `/speech-test` page
3. Take screenshots of the results and browser console
4. Open an issue in your repository with these details
