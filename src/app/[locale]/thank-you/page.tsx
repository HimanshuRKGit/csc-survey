"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { clearFormData } from "@/lib/autosave";

export default function ThankYouPage() {
  const t = useTranslations("thankYou");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const isOffline = searchParams.get("offline") === "1";

  // Clear any remaining draft data
  useEffect(() => {
    clearFormData();
  }, []);

  return (
    <div className="min-h-[calc(100dvh-56px)] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-lg animate-check-bounce">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-2 animate-fade-in">
          {t("title")}
        </h1>
        <p className="text-2xl sm:text-3xl font-bold text-navy-800 mb-4 animate-fade-in">
          Thank You!
        </p>

        <div className="card p-5 mb-6 animate-slide-up">
          <p className="text-text-secondary mb-2">{t("message")}</p>
          <p className="text-text-secondary text-sm">Your survey has been submitted successfully.</p>

          {isOffline && (
            <div className="mt-4 p-3 rounded-lg bg-warning-bg border border-amber-200 text-amber-800 text-sm">
              ⚠️ {tCommon("savedLocally")}
            </div>
          )}
        </div>

        <p className="text-sm text-text-muted mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {t("subtitle")}
          <br />
          <span className="text-xs">Thank you for contributing to the field data collection.</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/" className="btn-secondary flex-1" id="go-home-btn">
            🏠 {tCommon("goHome")} / Go Home
          </Link>
          <Link href="/survey" className="btn-primary flex-1" id="new-survey-btn">
            📋 {tCommon("newSurvey")} / New Survey
          </Link>
        </div>
      </div>
    </div>
  );
}
