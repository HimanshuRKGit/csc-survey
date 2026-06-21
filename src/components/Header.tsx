"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const newLocale = locale === "hi" ? "en" : "hi";
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-800 text-white shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            CS
          </div>
          <h1 className="text-base font-semibold tracking-tight">
            {t("appTitle")}
          </h1>
        </div>

        <button
          onClick={switchLocale}
          disabled={isPending}
          id="language-toggle"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                     bg-white/10 hover:bg-white/20 active:bg-white/25
                     border border-white/20 transition-all duration-200
                     disabled:opacity-50"
          aria-label={`Switch to ${locale === "hi" ? "English" : "Hindi"}`}
          style={{ minHeight: 40 }}
        >
          <span className="text-base">🌐</span>
          <span>{locale === "hi" ? "EN" : "हिंदी"}</span>
        </button>
      </div>
    </header>
  );
}
