# Setting up your Gemini API Key

To fix errors related to the Gemini API key (like `API key expired. Please renew the API key.` or `GEMINI_API_KEY is not set in environment variables`), follow these steps:

## 1. Get a Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Navigate to the "API keys" section in the left sidebar
4. Click "Create API key" button
5. Give your key a name (optional)
6. Copy your new API key immediately (it won't be shown again)

## 2. Set up your environment variables

### Option 1: Using a .env file (recommended for development)

1. Edit the `.env` file in the root of your project
2. Update the following line with your new API key:
```
GEMINI_API_KEY=your_new_api_key_here
```
3. Replace `your_new_api_key_here` with the API key you just created from Google AI Studio
4. Save the file

### Option 2: Using environment variables directly

#### For Windows (PowerShell):
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

#### For Windows (Command Prompt):
```cmd
set GEMINI_API_KEY=your_api_key_here
```

## 3. Test Your API Key (Optional)

You can use the included `test-gemini.js` script in the root of your project to verify your API key works:

1. Open a PowerShell terminal 
2. Run the test script with your new API key:

```powershell
$env:GEMINI_API_KEY="paste_your_new_api_key_here"; node test-gemini.js
```

If successful, you should see a response similar to:

```
API test successful!
Response: Hello! I'm the Grace College virtual assistant. How can I help you today?
```

If you see an error message, check that:
- You've copied the API key correctly (no extra spaces)
- Your API key is active and not expired
- You have an internet connection
- The model specified in the script (`gemini-2.0-flash`) is available

# 4. Run the development server

```bash
npm run dev
```

Your chatbot should now work correctly with the Gemini API integration.

## Important Notes

- Do not commit your API key to version control
- If you're deploying to a hosting platform like Vercel, set the environment variable in their dashboard
- The API key is only valid for the specified project and may have usage limits
