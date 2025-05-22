// This file checks browser compatibility with the Web Speech API
// Run this using developer tools console to check if your browser supports speech recognition

function checkSpeechRecognitionSupport() {
  console.log("Checking Web Speech API support...");
  
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
      
      // Check microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log("✅ Microphone access granted");
        })
        .catch(err => {
          console.error("❌ Microphone access denied:", err);
          console.log("Please allow microphone access for speech recognition to work");
        });
        
    } catch (err) {
      console.error("Error initializing SpeechRecognition:", err);
    }
  } else {
    console.error("❌ SpeechRecognition is NOT supported by this browser");
    console.log("Try using Chrome, Edge, or Safari");
  }
}

// Run the check
checkSpeechRecognitionSupport();
