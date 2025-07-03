import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="container mx-auto flex items-center h-16 justify-between text-blue-700 ">
      <span className="text-3xl bg-clip-text bg-gradient-to-r from-blue-800 to-muted-foreground text-transparent">
        Voice Scribe
      </span>
      <div className="flex items-center gap-4">
        <UserButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
