import { Link } from "@/i18n/navigation";

const earningPoints = [
  {
    hi: "आप रोज़ कितने ग्राहकों को सेवा देते हैं, और किस काम से सबसे ज़्यादा कमाई होती है — AEPS, PAN कार्ड, लोन, इंश्योरेंस, या कुछ और?",
    en: "How many customers do you serve daily, and which work brings the most income — AEPS, PAN card, loans, insurance, or something else?",
  },
  {
    hi: "क्या आपको पता है कि कुछ ऑपरेटर एक ही काम से दूसरों से ज़्यादा कमा रहे हैं? हम जानना चाहते हैं — फर्क कहां है, और क्या वो तरीका आप भी अपना सकते हैं।",
    en: "Did you know some operators earn more than others doing the exact same work? We want to find out where the difference lies — and whether that same method could work for you too.",
  },
  {
    hi: "हर महीने कितना कमीशन मिलता है, यह अक्सर बदलता रहता है। हम यह समझना चाहते हैं कि किन कामों में सबसे स्थिर और सबसे ज़्यादा कमाई है — ताकि सही जानकारी सबके पास पहुंचे।",
    en: "Monthly commission often varies. We want to understand which services give the most stable and highest earnings — so the right information reaches everyone.",
  },
] as const;

const opportunityPoints = [
  {
    hi: "जो ऑपरेटर अपनी सही कमाई और तरीका बताते हैं, उन्हीं की मदद से नए, बेहतर मौके बनते हैं — जैसे नए कमीशन प्लान, नई सेवाएं, या बेहतर पार्टनरशिप जो आपकी कमाई बढ़ा सकें।",
    en: "The operators who honestly share their real earnings and methods are exactly who new, better opportunities get built for — like new commission plans, new services, or better partnerships that could increase your income.",
  },
  {
    hi: "अभी बहुत से ऑपरेटर्स को पता ही नहीं कि कौन सी सेवा सबसे ज़्यादा कमाई दे रही है आसपास के इलाकों में। यह रिसर्च वो जानकारी इकट्ठा कर रही है — और हिस्सा लेने वालों को सबसे पहले बताएगी।",
    en: "Right now, many operators don't even know which service is earning the most in their area. This research is gathering exactly that information — and the people who participate will be told first.",
  },
  {
    hi: "अगर आगे कोई नया, ज़्यादा कमाई वाला मौका या पार्टनरशिप सामने आती है — जिन्होंने इस सर्वे में हिस्सा लिया, उन्हें प्राथमिकता मिलेगी।",
    en: "If a new, higher-earning opportunity or partnership comes forward in the future — the people who participated in this survey will get priority.",
  },
  {
    hi: "सिर्फ 5–8 मिनट लगेंगे। आपके समय और जानकारी की कद्र करते हुए, ₹100 की छोटी-सी भेंट दी जाएगी।",
    en: "Takes only 5–8 minutes. As a token of appreciation for your time and information, you'll receive ₹100.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="bg-navy-800 text-white px-4 pt-10 pb-10">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
            CSC, जन सेवा केंद्र<br />
            और साइबर कैफे<br />
            चलाने वाले भाई-बहनों —
          </h1>
          <p className="text-3xl sm:text-4xl font-bold text-green-300 mt-1 leading-snug">
            अपनी कमाई बढ़ाने का मौका है
          </p>
          <p className="text-base sm:text-lg font-medium text-white/70 mt-3 leading-relaxed">
            For CSC, Jan Seva Kendra, and Cyber Cafe Operators —<br className="hidden sm:inline" />
            A Chance to Increase Your Daily Earnings
          </p>

          <div
            className="mt-6 rounded-xl p-4 text-left border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <p className="text-sm leading-relaxed text-white/90">
              यह एक स्वतंत्र रिसर्च है। हम जानना चाहते हैं — आप रोज़ कैसे पैसे कमाते हैं, कौन से काम से ज़्यादा फायदा होता है, और कहां नए मौके छुपे हैं जो शायद आपको पता भी न हों।
            </p>
            <p className="text-xs leading-relaxed text-white/55 mt-2">
              This is independent research. We want to understand — how you earn money every day, which work brings the most benefit, and where new opportunities might be hiding that you may not even know about.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-7 space-y-8">

        {/* Section 2 — Earning Understanding */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 leading-snug">
            हम समझना चाहते हैं आपकी रोज़ की कमाई का तरीका
          </h2>
          <p className="text-sm text-text-secondary mt-1 mb-5">
            We Want to Understand How You Earn — Every Day
          </p>
          <div className="space-y-3">
            {earningPoints.map((point, i) => (
              <div key={i} className="card p-4 flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(45,106,79,0.12)" }}
                >
                  <span className="text-sm font-bold text-green-700">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800 leading-relaxed">{point.hi}</p>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{point.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Opportunity */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 leading-snug">
            यह सर्वे नए मौके खोल सकता है
          </h2>
          <p className="text-sm text-text-secondary mt-1 mb-5">
            This Survey Could Open New Opportunities
          </p>
          <div className="space-y-3">
            {opportunityPoints.map((point, i) => (
              <div key={i} className="card p-4 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm text-white font-bold leading-none">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800 leading-relaxed">{point.hi}</p>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{point.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Privacy */}
        <section
          className="card p-4"
          style={{ borderLeft: "4px solid var(--color-green-600)" }}
        >
          <p className="text-sm font-bold text-navy-800">
            🔒 आपकी जानकारी पूरी तरह सुरक्षित है
          </p>
          <p className="text-sm text-navy-800 leading-relaxed mt-2">
            आपके जवाब गोपनीय रहेंगे — सिर्फ रिसर्च के लिए। आपका नाम या दुकान का नाम किसी बैंक, कंपनी या तीसरे पक्ष के साथ कभी साझा नहीं होगा।
          </p>
          <p className="text-xs text-text-secondary mt-2 leading-relaxed">
            🔒 Your Privacy is Fully Protected — Answers are confidential and used only for research. Your name and shop will never be shared with any bank, company, or third party.
          </p>
        </section>

        {/* Section 5 — CTA */}
        <section className="text-center pb-2">
          <p className="text-base font-bold text-navy-800 leading-snug mb-1">
            अपनी कमाई की कहानी बताएं — नए मौके का हिस्सा बनें
          </p>
          <p className="text-xs text-text-secondary mb-5">
            Share Your Earning Story — Be Part of the Next Opportunity
          </p>

          <Link
            href="/survey"
            id="start-survey-btn"
            className="btn-primary w-full"
            style={{
              flexDirection: "column",
              gap: "2px",
              paddingTop: "1.125rem",
              paddingBottom: "1.125rem",
            }}
          >
            <span className="text-xl font-bold">सर्वे शुरू करें →</span>
            <span className="text-sm font-normal" style={{ opacity: 0.85 }}>Start Survey →</span>
          </Link>

          <p className="mt-3 text-sm font-semibold text-green-700">सिर्फ 5–8 मिनट लगेंगे</p>
          <p className="text-xs text-text-hint mt-0.5">Takes only 5–8 minutes</p>
          <p className="mt-3 text-xs font-medium text-navy-800">
            जो जानकारी देंगे, वही सबसे पहले मौका पाएंगे।
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            Those who share information will be the first to get the opportunity.
          </p>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="text-center py-5 px-4 text-xs text-text-hint border-t border-border">
        <p className="font-medium">स्वतंत्र फील्ड रिसर्च, 2026</p>
        <p className="mt-0.5">Independent field research, 2026</p>
      </footer>
    </div>
  );
}
