"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunks = useRef<Blob[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();

  const MAX_SECONDS = 10;

  useEffect(() => {
    if (!user) return;
    console.log("Logged in as:", user.id);
  }, [user]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    audioChunks.current = [];
    recorder.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      clearInterval(timerRef.current!);
      setElapsedTime(0);

      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      audioChunks.current = [];

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      try {
        const response = await fetch("/api/upload-recording", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setTranscript(result.transcription || "Transcription failed.");
      } catch (error) {
        console.error(error);
        setTranscript("Error uploading or transcribing audio.");
      }
    };

    recorder.start();
    setIsRecording(true);

    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setElapsedTime(seconds);
      if (seconds >= MAX_SECONDS) {
        stopRecording(); // auto-stop at limit
      }
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        {!isRecording ? (
          <Button onClick={startRecording}>🎤 Start Recording</Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive">
            ⏹️ Stop
          </Button>
        )}
        {isRecording && (
          <span className="text-gray-500">
            ⏱️ {elapsedTime}s / {MAX_SECONDS}s
          </span>
        )}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl text-gray-700 min-h-[50px]">
        {transcript ? transcript : "Your transcription will appear here..."}
      </div>
    </div>
  );
}
