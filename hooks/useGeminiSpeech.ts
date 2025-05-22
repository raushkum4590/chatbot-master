// Hook for handling speech recognition with Gemini API
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export function useGeminiSpeech() {  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);  // Check if browser supports MediaRecorder API  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasMediaDevices = !!(navigator.mediaDevices);
      // Correctly check if getUserMedia exists without causing TypeScript errors
      const hasGetUserMedia = !!(navigator.mediaDevices && 
                               navigator.mediaDevices.getUserMedia);
      const hasMediaRecorder = !!(window.MediaRecorder);
      
      const isFullySupported = hasMediaDevices && hasGetUserMedia && hasMediaRecorder;
      
      setIsSupported(isFullySupported);
      
      if (!isFullySupported) {
        if (!hasMediaDevices) {
          setError('Your browser does not support media devices.');
        } else if (!hasGetUserMedia) {
          setError('Your browser does not support getUserMedia.');
        } else if (!hasMediaRecorder) {
          setError('Your browser does not support MediaRecorder.');        } else {
          setError('Your browser does not support audio recording.');
        }
      }
    }
  }, []);
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser.');
      console.error('Speech recognition not supported - checks:', {
        mediaDevices: !!(navigator?.mediaDevices),
        getUserMedia: !!(navigator?.mediaDevices?.getUserMedia),
        mediaRecorder: !!(window?.MediaRecorder),
        isSecureContext: window?.isSecureContext
      });
      return;
    }

    try {
      setError(null);
      setAudioChunks([]);
      
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted, creating MediaRecorder...');
      
      // Set audio constraints for better quality
      const options = { 
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000 
      };
      
      // Try to create recorder with options, fall back to default if not supported
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
        console.log('Created MediaRecorder with options:', options);
      } catch (e) {
        console.warn('Failed to create MediaRecorder with these options, trying default', e);
        recorder = new MediaRecorder(stream);
        console.log('Created MediaRecorder with default options');
      }
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          console.log(`Recorded audio chunk: ${event.data.size} bytes`);
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      });
      
      recorder.addEventListener('start', () => {
        console.log('MediaRecorder started');
      });
      
      recorder.addEventListener('error', (e) => {
        console.error('MediaRecorder error:', e);
      });
      
      recorder.start(1000); // Collect data in 1-second chunks for more responsive experience
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Failed to start recording: ${err.message}. Please check your microphone permissions.`);
    }
  }, [isSupported]);
  // Stop recording
  const stopRecording = useCallback(async () => {
    if (!mediaRecorder) {
      console.warn('No mediaRecorder found when trying to stop recording');
      return;
    }
    
    console.log('Stopping recording...');
    setIsProcessing(true);
    
    try {
      // Create a promise to handle the stop event
      const stopPromise = new Promise<void>((resolve) => {
        const handleStop = async () => {
          try {
            // Combine audio chunks into a single blob
            console.log(`Combining ${audioChunks.length} audio chunks`);
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            console.log(`Created audio blob: ${audioBlob.size} bytes`);
            
            // Release microphone
            mediaRecorder.stream.getTracks().forEach(track => {
              track.stop();
              console.log(`Stopped audio track: ${track.kind}`);
            });
            
            // Send to API
            try {
              const formData = new FormData();
              formData.append('audio', audioBlob, 'recording.webm');
              
              console.log('Sending audio to API...');
              const response = await axios.post('/api/speech', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              
              console.log('Received API response:', response.data);
              
              if (response.data && response.data.text) {
                setTranscript(response.data.text);
                console.log('Transcription received:', response.data.text);
              } else {
                console.warn('API response did not contain text:', response.data);
                setError('Could not transcribe audio. The API response was empty or invalid.');
              }
            } catch (err: any) {
              console.error('Error sending audio to API:', err);
              if (axios.isAxiosError(err)) {
                setError(`Failed to process speech: ${err.message}. Status: ${err.response?.status || 'unknown'}`);
              } else {
                setError(`Failed to process speech: ${err.message}. Please try again.`);
              }
            } finally {
              resolve();
            }
          } catch (err: any) {
            console.error('Error in stop event handler:', err);
            setError(`Error processing recording: ${err.message}`);
            resolve();
          }
        };
        
        // Add the 'stop' event listener
        mediaRecorder.addEventListener('stop', handleStop);
        
        // Stop recording
        mediaRecorder.stop();
      });
      
      // Wait for the stop promise to resolve
      await stopPromise;
    } catch (err: any) {
      console.error('Error stopping recording:', err);
      setError(`Failed to stop recording: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder, audioChunks]);

  return {
    isRecording,
    isProcessing,
    isSupported,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript
  };
}
