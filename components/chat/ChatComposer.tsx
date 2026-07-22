"use client";

import React from "react";
import { ChatInput } from "./ChatInput";

export interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatComposer(props: ChatComposerProps) {
  return <ChatInput {...props} />;
}
