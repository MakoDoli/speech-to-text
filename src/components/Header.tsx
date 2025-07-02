import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="container mx-auto flex items-center h-16 justify-between text-blue-700 ">
      <span className="text-3xl bg-clip-text bg-gradient-to-r from-blue-800 to-muted-foreground text-transparent">
        Voice Scribe
      </span>
      <ThemeToggle />
    </header>
  );
}
