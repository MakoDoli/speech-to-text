"use client";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Loader, Videotape } from "lucide-react";
import RecordingCard from "./RecordingCard";

export type Recording = {
  id: string;
  fileUrl: string;
  transcript: string;
  createdAt: string;
};
export function AppSidebar() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      const res = await fetch("/api/recordings");
      const data = await res.json();

      setRecordings(data.recordings || []);
      setIsLoading(false);
    };

    fetchRecordings();
  }, []);
  return (
    <Sidebar variant="floating" className="mt-16  h-auto ">
      <SidebarHeader className="mb-4 text-secondary-foreground  ">
        <div className="flex gap-2">
          <Videotape className="opacity-80" />
          <h2 className="text-[16px]">My recordings</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {isLoading && <Loader className="animate-spin" />}
        {recordings.length === 0 && (
          <div className="text-secondary-foreground">
            No recordings yet. Let us hear your voice
          </div>
        )}
        {recordings.map((rec) => (
          <RecordingCard
            key={rec.id}
            src={rec.fileUrl}
            date={rec.createdAt}
            text={rec.transcript}
          />
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
