"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function RedirectButton({ text }: { text: string }) {
  const [count, setCount] = useState(3);
  const router = useRouter();

  const timer = setTimeout(() => {
    setCount((prev) => prev - 1);
  }, 1000);
  useEffect(() => {
    if (count < 1) router.push("/");
    return clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="flex flex-col items-center space-y-4 pl-10">
      <Button className="w-44">{text}</Button>
      <p className="text-muted-foreground"> Redirecting in {count}</p>
    </div>
  );
}
