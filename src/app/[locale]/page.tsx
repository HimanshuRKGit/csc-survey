import { Link } from "@/i18n/navigation";

const painPoints = [
  {
    hi: "कमीशन कितना मिलेगा और कब मिलेगा — यह अक्सर साफ नहीं होता। आप काम करते हैं, पर पैसे कब आएंगे यह अंदाज़ा नहीं।",
    en: "Commission amounts and payment dates are often unclear. You do the work, but you're left guessing when the money will arrive.",
  },
  {
    hi: "कभी-कभी ग्राहक का पैसा खाते से कट जाता है, पर ट्रांज़ेक्शन पूरा नहीं होता। ग्राहक नाराज़ होता है और समस्या सुलझाने की ज़िम्मेदारी आप पर आ जाती है।",
    en: "Sometimes money is deducted from the customer's account but the transaction doesn't go through. The customer gets upset, and you're left to sort it out.",
  },
  {
    hi: "जब पेमेंट में गड़बड़ी होती है, तो बैंक से बात करना और पैसे वापस करवाना — यह सब आपको खुद करना पड़ता है। कई-कई दिन लग जाते हैं, कभी-कभी नुकसान भी उठाना पड़ता है।",
    en: "When payments go wrong, you're the one chasing the bank for days to fix it — often absorbing the loss yourself in the meantime.",
  },
  {
    hi: "बिजली, इंटरनेट, किराया — सब बढ़ता जा रहा है। पर CSC, जन सेवा केंद्र या साइबर कैफे पर मिलने वाला कमीशन वहीं रहा या घट गया।",
    en: "Electricity, internet, rent — all rising. But the commission from CSC, Jan Seva Kendra, or Cyber Cafe work has stayed the same or shrunk.",
  },
  {
    hi: "एक ही इलाके में बहुत सारे केंद्र खुल गए हैं। वही ग्राहक, वही काम — सबके बीच बंट जाता है। आगे बढ़ने का रास्ता साफ नहीं दिखता।",
    en: "Too many centers have opened in the same area, splitting the same customers. There's no clear way to stand out or earn more.",
  },
  {
    hi: "कमीशन तय करने वाले, नियम बनाने वाले — वो कभी आपकी दुकान पर नहीं बैठे। उन्हें नहीं पता कि ज़मीन पर असल में क्या होता है।",
    en: "The people who set commission rates and make the rules have never sat at your counter. They don't know what it's actually like on the ground.",
  },
] as const;

const benefits = [
  {
    hi: "आपकी समस्याएं — देरी से पेमेंट, अस्पष्ट कमीशन, ट्रांज़ेक्शन विवाद — इस रिसर्च में दर्ज होंगी और आगे ले जाई जाएंगी। वरना ये मुश्किलें हमेशा अदृश्य ही रहती हैं।",
    en: "Your problems — delayed payments, unclear commissions, transaction disputes — get documented and raised, instead of staying invisible to the people who could fix them.",
  },
  {
    hi: "यह रिसर्च खासतौर पर इसलिए हो रही है ताकि कमीशन पेमेंट को ज़्यादा भरोसेमंद और साफ बनाया जा सके। आपके जवाब सीधे तय करेंगे कि आगे क्या प्रस्तावित हो।",
    en: "This research is specifically about making commission payments more reliable and transparent. Your honest answers directly shape what gets proposed next.",
  },
  {
    hi: "अगर इस रिसर्च से कोई बेहतर और भरोसेमंद कमाई का मौका सामने आता है, तो जिन ऑपरेटरों ने अपनी बात रखी — वो सबसे पहले जानेंगे।",
    en: "If a better, more reliable earning opportunity comes out of this research, the operators who shared their experience will be the first to know.",
  },
  {
    hi: "सिर्फ 5–8 मिनट लगेंगे। आपके समय और ईमानदारी की कद्र करते हुए, ₹100 की छोटी-सी नेक-नियत भेंट दी जाएगी।",
    en: "Takes only 5–8 minutes. As a small token of appreciation for your time and honesty, you'll receive ₹100.",
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
            यह सर्वे आपके लिए है
          </p>
          <p className="text-base sm:text-lg font-medium text-white/70 mt-3 leading-relaxed">
            For CSC, Jan Seva Kendra, and Cyber Cafe Operators —<br className="hidden sm:inline" />
            This Survey Is for You
          </p>

          <div
            className="mt-6 rounded-xl p-4 text-left border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <p className="text-sm leading-relaxed text-white/90">
              यह एक स्वतंत्र रिसर्च है — किसी बैंक, कंपनी या ऐप से नहीं जुड़ी। हम जानना चाहते हैं कि आप जैसे ऑपरेटर रोज़ किन मुश्किलों का सामना करते हैं।
            </p>
            <p className="text-xs leading-relaxed text-white/55 mt-2">
              Independent research — not affiliated with any bank, company, or app. We want to understand the real, everyday challenges operators like you face.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-7 space-y-8">

        {/* Pain Points */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 leading-snug">
            हम जानते हैं — आपके काम में ये मुश्किलें आती हैं
          </h2>
          <p className="text-sm text-text-secondary mt-1 mb-5">
            We Know the Problems You Deal With Every Day
          </p>
          <div className="space-y-3">
            {painPoints.map((point, i) => (
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

        {/* Benefits */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 leading-snug">
            तो इस सर्वे का जवाब देने से आपको क्या फायदा?
          </h2>
          <p className="text-sm text-text-secondary mt-1 mb-5">
            So What&apos;s in This for You?
          </p>
          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="card p-4 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm text-white font-bold leading-none">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-800 leading-relaxed">{benefit.hi}</p>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{benefit.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
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

        {/* CTA */}
        <section className="text-center pb-2">
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
            <span className="text-xl font-bold">सर्वे शुरू करें</span>
            <span className="text-sm font-normal" style={{ opacity: 0.85 }}>Start Survey</span>
          </Link>
          <p className="mt-3 text-sm font-semibold text-green-700">सिर्फ 5–8 मिनट लगेंगे</p>
          <p className="text-xs text-text-hint mt-0.5">Takes only 5–8 minutes</p>
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
