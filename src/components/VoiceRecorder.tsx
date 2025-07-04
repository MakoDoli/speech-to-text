"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { CircleStop, Mic, TimerReset } from "lucide-react";

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
      if (!user) return;

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
        //fetchRecordings()
      } catch (error) {
        console.error(error);
        setTranscript("Error uploading or transcribing audio.");
      }
    };

    recorder.start();
    setIsRecording(true);

    // recording duration limit
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setElapsedTime(seconds);
      if (seconds >= MAX_SECONDS) {
        stopRecording();
      }
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col gap-8 justify-center mt-12 ">
      <div className="flex gap-4 items-center">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="bg-gradient-to-r from-blue-800 to-muted-foreground hover:from-muted-foreground hover:to-blue-800 cursor-pointer transition-all duration-1000 "
          >
            <Mic />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="animate-pulse cursor-pointer"
          >
            <CircleStop /> Stop
          </Button>
        )}
        {isRecording && (
          <span className="text-muted-foreground flex gap-3">
            <TimerReset /> {elapsedTime}s / {MAX_SECONDS}s
          </span>
        )}
      </div>

      <div className="p-4 bg-muted text-muted-foreground  rounded-xl  min-h-[50px]">
        {transcript ? transcript : "Your transcription will appear here..."}
      </div>
    </div>
  );
}
