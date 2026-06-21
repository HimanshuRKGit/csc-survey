import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    { icon: "🌐", key: "bilingual" },
    { icon: "💾", key: "autoSave" },
    { icon: "📶", key: "offlineReady" },
    { icon: "📱", key: "mobileFirst" },
  ] as const;

  return (
    <div className="min-h-[calc(100dvh-56px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full text-center animate-fade-in">
          {/* Logo / Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl">📋</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 leading-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-green-600 mt-1 mb-4">
            {t("home.heroSubtitle")}
          </p>

          {/* Description Card */}
          <div className="card p-5 mb-6 text-left animate-slide-up">
            <p className="text-text-secondary text-sm leading-relaxed">
              {t("home.description")}
            </p>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {features.map(({ icon, key }) => (
              <div
                key={key}
                className="card flex items-center gap-2.5 p-3 text-left"
              >
                <span className="text-lg flex-shrink-0">{icon}</span>
                <span className="text-xs font-medium text-text-secondary leading-tight">
                  {t(`home.features.${key}`)}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/survey"
            className="btn-primary w-full text-lg animate-scale-in"
            style={{ animationDelay: "0.2s" }}
            id="start-survey-btn"
          >
            <span className="text-xl">🚀</span>
            {t("common.startSurvey")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 px-4 text-xs text-text-hint border-t border-border">
        CSC Field Survey © 2026
      </footer>
    </div>
  );
}
