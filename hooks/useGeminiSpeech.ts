// Hook for handling speech recognition with Gemini API
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export function useGeminiSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if browser supports MediaRecorder API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasMediaRecorder = !!(
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        window.MediaRecorder
      );
      
      setIsSupported(hasMediaRecorder);
      
      if (!hasMediaRecorder) {
        setError('Your browser does not support audio recording.');
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
      return;
    }

    try {
      setError(null);
      setAudioChunks([]);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      });
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  }, [isSupported]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (!mediaRecorder) return;
    
    setIsProcessing(true);
    
    try {
      // Create a function to handle the stop event
      const handleStop = async () => {
        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Release microphone
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        // Send to API
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          
          const response = await axios.post('/api/speech', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          if (response.data && response.data.text) {
            setTranscript(response.data.text);
          } else {
            setError('Could not transcribe audio.');
          }
        } catch (err) {
          console.error('Error sending audio to API:', err);
          setError('Failed to process speech. Please try again.');
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
          setMediaRecorder(null);
        }
      };
      
      // Add the 'stop' event listener
      mediaRecorder.addEventListener('stop', handleStop);
      
      // Stop recording
      mediaRecorder.stop();
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording.');
      setIsProcessing(false);
      setIsRecording(false);
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
