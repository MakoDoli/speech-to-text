"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RedirectButton({ text }: { text: string }) {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setTimeout(() => {
            router.push("/");
          }, 0);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 pl-10">
      <Link href="/">
        <Button className="w-44">{text}</Button>
      </Link>
      <p className="text-muted-foreground"> Redirecting in {count}</p>
    </div>
  );
}
