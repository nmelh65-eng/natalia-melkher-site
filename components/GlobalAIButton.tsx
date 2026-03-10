"use client";

import React, { useState } from "react";
import AIFloatingButton from "@/components/AIFloatingButton";
import AIWritingAgent from "@/components/AIWritingAgent";

export default function GlobalAIButton() {
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      {/* Плавающая кнопка — видна всегда когда чат закрыт */}
      {!showAI && (
        <AIFloatingButton onClick={() => setShowAI(true)} />
      )}

      {/* Чат AI-Музы */}
      {showAI && (
        <AIWritingAgent onClose={() => setShowAI(false)} />
      )}
    </>
  );
}
