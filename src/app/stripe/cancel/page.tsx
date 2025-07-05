import RedirectButton from "@/components/RedirectButton";
import { OctagonX } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="w-full justify-center flex flex-col items-center gap-14">
      <div className="flex items-center gap-5 text-xl">
        <OctagonX className="text-red-800" />
        Payment Failed
      </div>
      <RedirectButton text={"Try again"} />
    </div>
  );
}
