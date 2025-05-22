// This file checks browser compatibility with the Web Speech API
// Run this using developer tools console to check if your browser supports speech recognition

function checkSpeechRecognitionSupport() {
  console.log("Checking Web Speech API support...");
  
  // Log browser information
  console.log("Browser Information:");
  console.log("- User Agent:", navigator.userAgent);
  console.log("- Platform:", navigator.platform);
  console.log("- Language:", navigator.language);
  console.log("- Secure Context:", window.isSecureContext ? "Yes" : "No ⚠️");
  console.log("- Protocol:", window.location.protocol);
  
  if (!window.isSecureContext) {
    console.error("⚠️ Not in a secure context! Speech Recognition requires HTTPS.");
    console.log("Speech recognition will not work unless you're on a secure connection (https://)");
  }
  
  // Check if MediaDevices API is available
  if (navigator.mediaDevices) {
    console.log("✅ MediaDevices API is supported");
  } else {
    console.error("❌ MediaDevices API is NOT supported");
  }
  
  // Check if SpeechRecognition is available (standard or webkit prefixed)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition) {
    console.log("✅ SpeechRecognition is supported by this browser");
    
    try {
      const recognition = new SpeechRecognition();
      console.log("Speech Recognition capabilities:");
      console.log("- continuous:", typeof recognition.continuous !== "undefined");
      console.log("- interimResults:", typeof recognition.interimResults !== "undefined");
      console.log("- maxAlternatives:", typeof recognition.maxAlternatives !== "undefined");
      
      // Check which variant is available
      if (window.SpeechRecognition) {
        console.log("✅ Using standard SpeechRecognition API");
      } else if (window.webkitSpeechRecognition) {
        console.log("✅ Using webkit prefixed SpeechRecognition API");
      }
      
      // Check microphone access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            console.log("✅ Microphone access granted");
            testBasicRecognition();
          })
          .catch(err => {
            console.error("❌ Microphone access denied:", err);
            console.log("Please allow microphone access for speech recognition to work");
          });
      } else {
        console.error("❌ getUserMedia is not supported by this browser");
      }
        
    } catch (err) {
      console.error("Error initializing SpeechRecognition:", err);
    }
  } else {
    console.error("❌ SpeechRecognition is NOT supported by this browser");
    console.log("Try using Chrome, Edge, or Safari");
  }
  
  // Check for MediaRecorder API for Gemini speech support
  if (window.MediaRecorder) {
    console.log("✅ MediaRecorder API is supported (needed for Gemini speech)");
    
    // Check supported MIME types
    console.log("Supported MIME types for MediaRecorder:");
    const mimeTypes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg'
    ];
    
    mimeTypes.forEach(mimeType => {
      const isSupported = MediaRecorder.isTypeSupported(mimeType);
      console.log(`- ${mimeType}: ${isSupported ? "✅" : "❌"}`);
    });
  } else {
    console.error("❌ MediaRecorder API is NOT supported (required for Gemini speech)");
  }
}

function testBasicRecognition() {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    
    console.log("Starting a quick 3-second test of speech recognition...");
    
    recognition.onstart = () => {
      console.log("Speech recognition started. Try saying something...");
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      console.log(`Heard: "${transcript}" (confidence: ${Math.round(confidence * 100)}%)`);
    };
    
    recognition.onerror = (event) => {
      console.error(`Error during speech recognition test: ${event.error}`);
    };
    
    recognition.onend = () => {
      console.log("Speech recognition test ended");
    };
    
    recognition.start();
    
    // Stop after 3 seconds
    setTimeout(() => {
      recognition.stop();
    }, 3000);
  } catch (err) {
    console.error("Error during test recognition:", err);
  }
}

// Run the check
checkSpeechRecognitionSupport();
