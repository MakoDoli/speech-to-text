"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Loader2Icon } from "lucide-react";

type Recording = {
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
      console.log(data);
      setRecordings(data.recordings || []);
      setIsLoading(false);
    };

    fetchRecordings();
  }, []);
  return (
    <Sidebar variant="floating" className="mt-16  h-auto ">
      <SidebarHeader className="mb-4">My recordings</SidebarHeader>
      <SidebarContent className="p-2">
        {isLoading && <Loader2Icon className="animate-spin" />}
        {recordings.length === 0 && <div>No recordings yet.</div>}
        {recordings.map((rec) => (
          <Card key={rec.id} className="p-2">
            <audio controls src={rec.fileUrl} className="w-full h-8" />
            <p className="text-xs text-muted-foreground  ">
              {new Date(rec.createdAt).toLocaleString()}
            </p>
            <p className="">{rec.transcript}</p>
          </Card>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
