"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Recording = {
  id: string;
  fileUrl: string;
  transcript: string;
  createdAt: string;
};
type RecordingsContext = {
  recordings: Recording[];
  isLoading: boolean;
  fetchRecordings: () => Promise<void>;
};
export const RecordingsContext = createContext<RecordingsContext | undefined>(
  undefined
);

export function RecordingsProvider({ children }: { children: ReactNode }) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchRecordings = async () => {
    const res = await fetch("/api/recordings");
    const data = await res.json();

    setRecordings(data.recordings || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  return (
    <RecordingsContext.Provider
      value={{ recordings, isLoading, fetchRecordings }}
    >
      {children}
    </RecordingsContext.Provider>
  );
}

export default function useRecordings() {
  const context = useContext(RecordingsContext);
  if (!context)
    throw new Error("Context must be used within RecordingsProvider");
  return context;
}
