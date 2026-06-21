"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { processQueue } from "@/lib/autosave";

export function OfflineBanner() {
  const t = useTranslations("common");
  const [isOffline, setIsOffline] = useState(false);
  const [queueMessage, setQueueMessage] = useState("");

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = async () => {
      setIsOffline(false);
      // Try to process any queued submissions
      try {
        const count = await processQueue();
        if (count > 0) {
          setQueueMessage(t("queueProcessed"));
          setTimeout(() => setQueueMessage(""), 5000);
        }
      } catch {
        // Silently fail — queue will retry next time
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [t]);

  if (!isOffline && !queueMessage) return null;

  return (
    <div
      role="alert"
      className={`px-4 py-3 text-center text-sm font-medium animate-slide-up ${
        isOffline
          ? "bg-warning-bg text-amber-800 border-b border-amber-200"
          : "bg-success-bg text-green-800 border-b border-green-200"
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-2">
        <span>{isOffline ? "⚠️" : "✅"}</span>
        <span>{isOffline ? t("offline") : queueMessage}</span>
      </div>
    </div>
  );
}
