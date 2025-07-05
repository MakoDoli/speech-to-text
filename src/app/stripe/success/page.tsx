import RedirectButton from "@/components/RedirectButton";
import { CheckCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="w-full justify-center flex flex-col items-center gap-14">
      <div className="flex items-center gap-5 text-xl">
        <CheckCircle className="text-blue-800" />
        Payment successful
      </div>
      <RedirectButton text={"Great! Let's record!"} />
    </div>
  );
}
