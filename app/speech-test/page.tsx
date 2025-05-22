"use client";
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function SpeechTest() {
  const [mounted, setMounted] = useState(false);
  const [supportInfo, setSupportInfo] = useState<string>('Checking browser compatibility...');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [userSaid, setUserSaid] = useState<string>('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    clearTranscriptOnListen: false,
  });
  useEffect(() => {
    setMounted(true);
    
    // Check browser support
    if (!browserSupportsSpeechRecognition) {
      setSupportInfo('❌ Your browser does not support speech recognition. Try Chrome, Edge, or Safari.');
    } else {
      setSupportInfo('✅ Your browser supports speech recognition!');
      
      // Add browser details
      addTestResult(`Browser: ${navigator.userAgent}`);
      addTestResult(`Protocol: ${window.location.protocol}`);
      addTestResult(`Secure Context: ${window.isSecureContext ? 'Yes' : 'No'}`);
      
      // Check for SpeechRecognition API
      const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
      addTestResult(`SpeechRecognition API: ${hasSpeechRecognition ? 'Available' : 'Not Available'}`);
      
      // Check microphone
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            addTestResult('✅ Microphone permission granted');
          })
          .catch(err => {
            addTestResult(`❌ Microphone permission denied: ${err.message}`);
          });
      }
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (transcript) {
      setUserSaid(transcript);
    }
  }, [transcript]);

  const startListening = () => {
    addTestResult('Starting speech recognition...');
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US',
      interimResults: true
    });
  };

  const stopListening = () => {
    addTestResult('Stopping speech recognition...');
    SpeechRecognition.stopListening();
  };

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  if (!mounted) {
    return <div>Loading speech test...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Speech Recognition Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold">Browser Support</h2>
        <p className={browserSupportsSpeechRecognition ? "text-green-600" : "text-red-600"}>
          {supportInfo}
        </p>
      </div>
      
      <div className="mb-6 space-y-2">
        <button 
          onClick={listening ? stopListening : startListening}
          className={`px-4 py-2 rounded ${listening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {listening ? 'Stop Listening' : 'Start Listening'}
        </button>
        
        {listening && (
          <div className="inline-flex items-center ml-4 text-red-500">
            <span className="animate-pulse mr-1">●</span> Listening...
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="font-semibold mb-2">What you said:</h2>
        <div className="p-4 border rounded-lg min-h-[100px] bg-white">
          {userSaid || "(Nothing yet)"}
        </div>
      </div>
      
      <div>
        <h2 className="font-semibold mb-2">Test Results:</h2>
        <div className="p-4 border rounded-lg bg-gray-50 max-h-[200px] overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet</p>
          ) : (
            <ul className="space-y-1">
              {testResults.map((result, index) => (
                <li key={index} className="text-sm font-mono">{result}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
