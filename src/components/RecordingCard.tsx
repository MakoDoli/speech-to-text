import React from "react";
import { Card } from "./ui/card";
import { BookOpenText } from "lucide-react";

type RecordingUI = {
  src: string;
  text: string;
  date: string;
};

export default function RecordingCard({ src, date, text }: RecordingUI) {
  return (
    <Card className="p-2 hover:shadow-md   ">
      <audio controls className="w-full h-8" src={src} />

      <p className="text-xs text-muted-foreground  ">
        {new Date(date).toLocaleString()}
      </p>
      <div className="flex gap-3">
        <BookOpenText />
        <p className="text-secondary-foreground">{text}</p>
      </div>
    </Card>
  );
}
