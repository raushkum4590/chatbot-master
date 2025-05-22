"use client";
import { useState, useEffect } from 'react';

export default function SpeechDiagnostics() {
  const [diagnostics, setDiagnostics] = useState({
    browserName: "",
    version: "",
    secureContext: false,
    speechRecognitionSupport: false,
    webkitSpeechRecognitionSupport: false,
    mediaDevicesSupport: false,
    microphonePermission: "unknown"
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      // Detect browser
      const userAgent = navigator.userAgent;
      let browserName = "Unknown";
      let version = "Unknown";
      
      if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "";
      } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "";
      } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
        version = userAgent.match(/Safari\/([0-9.]+)/)?.[1] || "";
      } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
        browserName = "Edge";
        version = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "";
      }
      
      // Check for secure context
      const isSecureContext = window.isSecureContext || false;
      
      // Check for speech recognition support
      const hasSpeechRecognition = 'SpeechRecognition' in window;
      const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
      
      // Check for media devices support
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      
      setDiagnostics({
        browserName,
        version,
        secureContext: isSecureContext,
        speechRecognitionSupport: hasSpeechRecognition,
        webkitSpeechRecognitionSupport: hasWebkitSpeechRecognition,
        mediaDevicesSupport: hasMediaDevices,
        microphonePermission: "checking"
      });
      
      // Check microphone permission
      if (hasMediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setDiagnostics(prev => ({ ...prev, microphonePermission: "granted" }));
          })
          .catch(() => {
            setDiagnostics(prev => ({ ...prev, microphonePermission: "denied" }));
          });
      }
    }
  }, []);

  if (!mounted) {
    return <div>Loading diagnostics...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Speech Recognition Diagnostics</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Browser:</div>
          <div>{diagnostics.browserName} {diagnostics.version}</div>
          
          <div className="font-medium">Secure Context:</div>
          <div className={diagnostics.secureContext ? "text-green-600" : "text-red-600"}>
            {diagnostics.secureContext ? "Yes ✅" : "No ❌"}
            {!diagnostics.secureContext && (
              <p className="text-xs text-red-600 mt-1">
                Speech recognition requires HTTPS. Your site must be on a secure connection.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Speech Recognition Support</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">SpeechRecognition API:</div>
          <div className={diagnostics.speechRecognitionSupport ? "text-green-600" : "text-red-600"}>
            {diagnostics.speechRecognitionSupport ? "Supported ✅" : "Not Supported ❌"}
          </div>
          
          <div className="font-medium">WebkitSpeechRecognition:</div>
          <div className={diagnostics.webkitSpeechRecognitionSupport ? "text-green-600" : "text-red-600"}>
            {diagnostics.webkitSpeechRecognitionSupport ? "Supported ✅" : "Not Supported ❌"}
          </div>
          
          <div className="font-medium">Overall Status:</div>
          <div className={diagnostics.speechRecognitionSupport || diagnostics.webkitSpeechRecognitionSupport ? "text-green-600" : "text-red-600"}>
            {diagnostics.speechRecognitionSupport || diagnostics.webkitSpeechRecognitionSupport ? 
              "Your browser supports speech recognition ✅" : 
              "Your browser does not support speech recognition ❌"}
          </div>
        </div>
        
        {!diagnostics.speechRecognitionSupport && !diagnostics.webkitSpeechRecognitionSupport && (
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-yellow-800 text-sm">
            <p className="font-semibold">Recommended Browsers:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Chrome (version 33+)</li>
              <li>Edge (version 79+)</li>
              <li>Safari (version 14.1+)</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Microphone Access</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">MediaDevices API:</div>
          <div className={diagnostics.mediaDevicesSupport ? "text-green-600" : "text-red-600"}>
            {diagnostics.mediaDevicesSupport ? "Supported ✅" : "Not Supported ❌"}
          </div>
          
          <div className="font-medium">Microphone Permission:</div>
          <div className={
            diagnostics.microphonePermission === "granted" ? "text-green-600" : 
            diagnostics.microphonePermission === "denied" ? "text-red-600" : 
            "text-yellow-600"
          }>
            {diagnostics.microphonePermission === "granted" ? "Granted ✅" : 
             diagnostics.microphonePermission === "denied" ? "Denied ❌" : 
             "Checking..."}
          </div>
        </div>
        
        {diagnostics.microphonePermission === "denied" && (
          <div className="mt-4 p-3 bg-red-100 rounded-lg text-red-800 text-sm">
            <p className="font-semibold">Microphone access is denied.</p>
            <p className="mt-1">Please allow microphone access in your browser settings to use speech recognition.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recommendation</h2>
        {diagnostics.secureContext && 
         (diagnostics.speechRecognitionSupport || diagnostics.webkitSpeechRecognitionSupport) && 
         diagnostics.mediaDevicesSupport && 
         diagnostics.microphonePermission === "granted" ? (
          <div className="p-3 bg-green-100 rounded-lg text-green-800">
            <p className="font-semibold">✅ Your browser should support speech recognition!</p>
            <p className="mt-1">If you're still having issues, try using the following test phrases:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>"What is the average GPA of admitted students?"</li>
              <li>"Tell me about scholarship opportunities"</li>
              <li>"When is the application deadline?"</li>
            </ul>
          </div>
        ) : (
          <div className="p-3 bg-red-100 rounded-lg text-red-800">
            <p className="font-semibold">❌ Speech recognition may not work correctly.</p>
            <p className="mt-1">Please check the following:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Use a modern browser like Chrome, Edge, or Safari</li>
              <li>Make sure you're on HTTPS (secure connection)</li>
              <li>Allow microphone access when prompted</li>
              <li>If using mobile, ensure your device supports speech recognition</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
