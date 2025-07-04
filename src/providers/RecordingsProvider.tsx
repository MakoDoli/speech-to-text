import { Recording } from "@/components/AppSidebar";
import { createContext } from "react";

type RecordingsContext = {
  recordings: Recording[];
};
export const RecordingsContext = createContext<RecordingsContext | undefined>(
  undefined
);
