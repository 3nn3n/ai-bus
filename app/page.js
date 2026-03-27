"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import ChatInputBox from "./_components/ChatInputBox";
import { Suspense } from "react";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <div>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatInputBox />
      </Suspense>
    </div>
  );
}
