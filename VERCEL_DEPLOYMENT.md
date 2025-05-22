# Deploying to Vercel with Speech Recognition

This guide provides detailed steps to deploy the chatbot with speech recognition capabilities to Vercel.

## Preparation

1. **Fix TypeScript errors**: Ensure all TypeScript errors are resolved before deploying
2. **Configure environment variables**: Set up the required API keys for Gemini
3. **Set up proper CORS headers**: Configure cross-origin headers for speech recognition

## Deployment Steps

### 1. Setup Vercel

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI (optional):
   ```
   npm install -g vercel
   ```

### 2. Configure Environment Variables

1. Create or update your Vercel project
2. Add the following environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NEXT_PUBLIC_GEMINI_API_KEY`: The same API key (for client-side usage)

### 3. Deploy with Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your repository in the Vercel dashboard
3. Select the appropriate framework preset (Next.js)
4. Configure build settings:
   - Build Command: `npm run build:vercel`
   - Output Directory: `.next`
5. Add environment variables
6. Deploy your site

### 4. Deploy with Vercel CLI

Alternatively, you can deploy using the Vercel CLI:

1. Login to Vercel:
   ```
   vercel login
   ```
2. Deploy the project:
   ```
   vercel --prod
   ```

## Troubleshooting Vercel Deployment

### Build Errors

If you encounter build errors:

1. **TypeScript errors**: 
   - The `next.config.js` is configured to ignore TypeScript errors during build
   - Check the build logs for warnings about potential issues

2. **Permission errors**:
   - These are typically resolved by Vercel's build system
   - If you encounter `EPERM` errors in development, they won't affect Vercel deployment

### Speech Recognition Issues

If speech recognition doesn't work on your deployed site:

1. **Check headers**:
   - Verify that the CORS headers are being applied correctly
   - Use browser devtools to check for CORS errors

2. **Browser compatibility**:
   - Ensure users are on Chrome, Edge, or Safari
   - Test on multiple browsers to isolate issues

3. **Microphone permissions**:
   - Users must grant microphone access when prompted
   - Some browsers may block microphone access on insecure sites

4. **Run diagnostics**:
   - Direct users to the `/speech-test` page to verify their browser compatibility
   - Check browser console for specific errors

## Performance Optimization

1. **Optimize speech processing**:
   - Consider implementing server-side caching for frequent queries
   - Use streaming responses for better user experience

2. **Reduce bundle size**:
   - Remove unused dependencies
   - Implement code splitting for speech recognition features

## Maintenance

1. **Monitor API usage**:
   - Keep track of your Gemini API usage
   - Set up alerts for when you approach rate limits

2. **Update dependencies**:
   - Regularly update the speech recognition libraries
   - Monitor for security vulnerabilities

By following these steps, you should be able to successfully deploy your chatbot with speech recognition capabilities to Vercel.
