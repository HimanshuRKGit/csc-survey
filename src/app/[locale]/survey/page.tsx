"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormField } from "@/components/FormField";
import { SectionHeader } from "@/components/SectionHeader";
import { submitSurvey, SurveyResponse } from "@/lib/supabase";
import {
  saveFormData,
  loadFormData,
  clearFormData,
  queueSubmission,
} from "@/lib/autosave";

interface FormData {
  researcher_name: string;
  center_name: string;
  location_area: string;
  pincode: string;
  district_state: string;
  tier_level: string;
  center_type: string;
  operator_name: string;
  operator_gender: string;
  operator_age: string;
  years_in_business: string;
  main_service: string;
  daily_customers: string;
  current_bank_partner: string;
  commission_per_card_loan: string;
  sells_insurance: string;
  insurance_commission: string;
  payout_timing: string;
  had_payment_dispute: string;
  dispute_resolution_time: string;
  biggest_payout_problem: string;
  open_to_new_platform: string;
  most_important_factor: string;
  open_to_whatsapp: string;
  whatsapp_number: string;
  other_problems: string;
  one_thing_to_change: string;
}

const initialFormData: FormData = {
  researcher_name: "",
  center_name: "",
  location_area: "",
  pincode: "",
  district_state: "",
  tier_level: "",
  center_type: "",
  operator_name: "",
  operator_gender: "",
  operator_age: "",
  years_in_business: "",
  main_service: "",
  daily_customers: "",
  current_bank_partner: "",
  commission_per_card_loan: "",
  sells_insurance: "",
  insurance_commission: "",
  payout_timing: "",
  had_payment_dispute: "",
  dispute_resolution_time: "",
  biggest_payout_problem: "",
  open_to_new_platform: "",
  most_important_factor: "",
  open_to_whatsapp: "",
  whatsapp_number: "",
  other_problems: "",
  one_thing_to_change: "",
};

export default function SurveyPage() {
  const t = useTranslations("survey");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedLocally, setSavedLocally] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialized = useRef(false);

  // Load saved form data on mount
  useEffect(() => {
    const saved = loadFormData();
    if (saved) {
      setFormData((prev) => ({ ...prev, ...saved }));
    }
    isInitialized.current = true;
  }, []);

  // Auto-save on form changes (debounced)
  useEffect(() => {
    if (!isInitialized.current) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      saveFormData(formData);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData]);

  const updateField = useCallback(
    (field: keyof FormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.researcher_name.trim()) {
      newErrors.researcher_name = t("validation.researcherRequired");
    }
    if (!formData.center_name.trim()) {
      newErrors.center_name = t("validation.centerNameRequired");
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = t("validation.pincodeRequired");
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = t("validation.pincodeInvalid");
    }
    if (
      formData.open_to_whatsapp === "Yes" &&
      formData.whatsapp_number.trim() &&
      !/^[6-9]\d{9}$/.test(formData.whatsapp_number.trim())
    ) {
      newErrors.whatsapp_number = t("validation.whatsappInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSavedLocally(false);

    if (!validate()) {
      // Scroll to first error
      const firstErrorField = document.querySelector(".field-error");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    const surveyData: SurveyResponse = {
      ...formData,
      language_used: locale === "hi" ? "Hindi" : "English",
    };

    try {
      if (!navigator.onLine) {
        throw new Error("offline");
      }
      await submitSurvey(surveyData);
      clearFormData();
      router.push("/thank-you");
    } catch {
      // Save locally and queue for retry
      queueSubmission(surveyData);
      clearFormData();
      setSavedLocally(true);
      setSubmitError("");

      // If online but failed, show error
      if (navigator.onLine) {
        setSubmitError(tCommon("savedLocally"));
      }

      // Navigate to thank-you with offline flag
      router.push("/thank-you?offline=1");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-12 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-800">{t("pageTitle")}</h1>
        <p className="text-sm text-text-muted mt-1">Survey Form</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ===== Researcher Name ===== */}
        <div className="card p-5 mb-4">
          <FormField
            hiLabel={t("researcherName.hi")}
            enLabel={t("researcherName.en")}
            name="researcher_name"
            value={formData.researcher_name}
            onChange={updateField("researcher_name")}
            required
            error={errors.researcher_name}
            placeholder="शोधकर्ता का नाम / Researcher Name"
          />
        </div>

        {/* ===== Section A — Basic Information ===== */}
        <SectionHeader
          hiTitle={t("sectionA.title.hi")}
          enTitle={t("sectionA.title.en")}
          sectionNumber="A"
        />
        <div className="card p-5 mb-4 space-y-1">
          <FormField
            hiLabel={t("sectionA.centerName.hi")}
            enLabel={t("sectionA.centerName.en")}
            name="center_name"
            value={formData.center_name}
            onChange={updateField("center_name")}
            required
            error={errors.center_name}
          />
          <FormField
            hiLabel={t("sectionA.locationArea.hi")}
            enLabel={t("sectionA.locationArea.en")}
            name="location_area"
            value={formData.location_area}
            onChange={updateField("location_area")}
          />
          <FormField
            hiLabel={t("sectionA.pincode.hi")}
            enLabel={t("sectionA.pincode.en")}
            name="pincode"
            type="tel"
            value={formData.pincode}
            onChange={updateField("pincode")}
            required
            error={errors.pincode}
            placeholder="6 अंकों का पिनकोड / 6-digit pincode"
          />
          <FormField
            hiLabel={t("sectionA.districtState.hi")}
            enLabel={t("sectionA.districtState.en")}
            name="district_state"
            value={formData.district_state}
            onChange={updateField("district_state")}
          />
          <FormField
            hiLabel={t("sectionA.tierLevel.hi")}
            enLabel={t("sectionA.tierLevel.en")}
            name="tier_level"
            type="select"
            value={formData.tier_level}
            onChange={updateField("tier_level")}
            options={[
              { value: "Tier 1", label: t("sectionA.tierLevel.options.tier1") },
              { value: "Tier 2", label: t("sectionA.tierLevel.options.tier2") },
              { value: "Tier 3", label: t("sectionA.tierLevel.options.tier3") },
              { value: "Rural", label: t("sectionA.tierLevel.options.rural") },
            ]}
          />
          <FormField
            hiLabel={t("sectionA.centerType.hi")}
            enLabel={t("sectionA.centerType.en")}
            name="center_type"
            type="select"
            value={formData.center_type}
            onChange={updateField("center_type")}
            options={[
              { value: "CSC", label: t("sectionA.centerType.options.csc") },
              { value: "JSK", label: t("sectionA.centerType.options.jsk") },
              { value: "Cyber Cafe", label: t("sectionA.centerType.options.cyberCafe") },
              { value: "Combined", label: t("sectionA.centerType.options.combined") },
              { value: "Other", label: t("sectionA.centerType.options.other") },
            ]}
          />
          <FormField
            hiLabel={t("sectionA.operatorName.hi")}
            enLabel={t("sectionA.operatorName.en")}
            name="operator_name"
            value={formData.operator_name}
            onChange={updateField("operator_name")}
          />
          <FormField
            hiLabel={t("sectionA.operatorGender.hi")}
            enLabel={t("sectionA.operatorGender.en")}
            name="operator_gender"
            type="radio"
            value={formData.operator_gender}
            onChange={updateField("operator_gender")}
            options={[
              { value: "Male", label: t("sectionA.operatorGender.options.male") },
              { value: "Female", label: t("sectionA.operatorGender.options.female") },
            ]}
          />
          <FormField
            hiLabel={t("sectionA.operatorAge.hi")}
            enLabel={t("sectionA.operatorAge.en")}
            name="operator_age"
            value={formData.operator_age}
            onChange={updateField("operator_age")}
          />
        </div>

        {/* ===== Section B — Rapport Questions ===== */}
        <SectionHeader
          hiTitle={t("sectionB.title.hi")}
          enTitle={t("sectionB.title.en")}
          sectionNumber="B"
        />
        <div className="card p-5 mb-4 space-y-1">
          <FormField
            hiLabel={t("sectionB.yearsInBusiness.hi")}
            enLabel={t("sectionB.yearsInBusiness.en")}
            name="years_in_business"
            value={formData.years_in_business}
            onChange={updateField("years_in_business")}
          />
          <FormField
            hiLabel={t("sectionB.mainService.hi")}
            enLabel={t("sectionB.mainService.en")}
            name="main_service"
            value={formData.main_service}
            onChange={updateField("main_service")}
          />
          <FormField
            hiLabel={t("sectionB.dailyCustomers.hi")}
            enLabel={t("sectionB.dailyCustomers.en")}
            name="daily_customers"
            value={formData.daily_customers}
            onChange={updateField("daily_customers")}
          />
        </div>

        {/* ===== Section C — Commission & Earnings ===== */}
        <SectionHeader
          hiTitle={t("sectionC.title.hi")}
          enTitle={t("sectionC.title.en")}
          sectionNumber="C"
        />
        <div className="card p-5 mb-4 space-y-1">
          <FormField
            hiLabel={t("sectionC.currentBankPartner.hi")}
            enLabel={t("sectionC.currentBankPartner.en")}
            name="current_bank_partner"
            value={formData.current_bank_partner}
            onChange={updateField("current_bank_partner")}
          />
          <FormField
            hiLabel={t("sectionC.commissionPerCardLoan.hi")}
            enLabel={t("sectionC.commissionPerCardLoan.en")}
            name="commission_per_card_loan"
            value={formData.commission_per_card_loan}
            onChange={updateField("commission_per_card_loan")}
          />
          <FormField
            hiLabel={t("sectionC.sellsInsurance.hi")}
            enLabel={t("sectionC.sellsInsurance.en")}
            name="sells_insurance"
            type="radio"
            value={formData.sells_insurance}
            onChange={updateField("sells_insurance")}
            options={[
              { value: "Yes", label: t("sectionC.sellsInsurance.options.yes") },
              { value: "No", label: t("sectionC.sellsInsurance.options.no") },
              { value: "Sometimes", label: t("sectionC.sellsInsurance.options.sometimes") },
            ]}
          />
          <FormField
            hiLabel={t("sectionC.insuranceCommission.hi")}
            enLabel={t("sectionC.insuranceCommission.en")}
            name="insurance_commission"
            value={formData.insurance_commission}
            onChange={updateField("insurance_commission")}
          />
        </div>

        {/* ===== Section D — Reliability & Pain Points ===== */}
        <SectionHeader
          hiTitle={t("sectionD.title.hi")}
          enTitle={t("sectionD.title.en")}
          sectionNumber="D"
        />
        <div className="card p-5 mb-4 space-y-1">
          <FormField
            hiLabel={t("sectionD.payoutTiming.hi")}
            enLabel={t("sectionD.payoutTiming.en")}
            name="payout_timing"
            type="radio"
            value={formData.payout_timing}
            onChange={updateField("payout_timing")}
            options={[
              { value: "On time", label: t("sectionD.payoutTiming.options.onTime") },
              { value: "Sometimes delayed", label: t("sectionD.payoutTiming.options.sometimesDelayed") },
              { value: "Always delayed", label: t("sectionD.payoutTiming.options.alwaysDelayed") },
            ]}
          />
          <FormField
            hiLabel={t("sectionD.hadPaymentDispute.hi")}
            enLabel={t("sectionD.hadPaymentDispute.en")}
            name="had_payment_dispute"
            type="radio"
            value={formData.had_payment_dispute}
            onChange={updateField("had_payment_dispute")}
            options={[
              { value: "Yes multiple times", label: t("sectionD.hadPaymentDispute.options.yesMultiple") },
              { value: "Yes once or twice", label: t("sectionD.hadPaymentDispute.options.yesOnce") },
              { value: "No", label: t("sectionD.hadPaymentDispute.options.no") },
            ]}
          />
          <FormField
            hiLabel={t("sectionD.disputeResolutionTime.hi")}
            enLabel={t("sectionD.disputeResolutionTime.en")}
            name="dispute_resolution_time"
            value={formData.dispute_resolution_time}
            onChange={updateField("dispute_resolution_time")}
          />
          <FormField
            hiLabel={t("sectionD.biggestPayoutProblem.hi")}
            enLabel={t("sectionD.biggestPayoutProblem.en")}
            name="biggest_payout_problem"
            type="textarea"
            value={formData.biggest_payout_problem}
            onChange={updateField("biggest_payout_problem")}
          />
        </div>

        {/* ===== Section E — Opportunity ===== */}
        <SectionHeader
          hiTitle={t("sectionE.title.hi")}
          enTitle={t("sectionE.title.en")}
          sectionNumber="E"
        />
        <div className="card p-5 mb-4 space-y-1">
          <FormField
            hiLabel={t("sectionE.openToNewPlatform.hi")}
            enLabel={t("sectionE.openToNewPlatform.en")}
            name="open_to_new_platform"
            type="radio"
            value={formData.open_to_new_platform}
            onChange={updateField("open_to_new_platform")}
            options={[
              { value: "Yes definitely", label: t("sectionE.openToNewPlatform.options.yesDefinitely") },
              { value: "Maybe", label: t("sectionE.openToNewPlatform.options.maybe") },
              { value: "No", label: t("sectionE.openToNewPlatform.options.no") },
            ]}
          />
          <FormField
            hiLabel={t("sectionE.mostImportantFactor.hi")}
            enLabel={t("sectionE.mostImportantFactor.en")}
            name="most_important_factor"
            value={formData.most_important_factor}
            onChange={updateField("most_important_factor")}
          />
          <FormField
            hiLabel={t("sectionE.openToWhatsapp.hi")}
            enLabel={t("sectionE.openToWhatsapp.en")}
            name="open_to_whatsapp"
            type="radio"
            value={formData.open_to_whatsapp}
            onChange={updateField("open_to_whatsapp")}
            options={[
              { value: "Yes", label: t("sectionE.openToWhatsapp.options.yes") },
              { value: "No", label: t("sectionE.openToWhatsapp.options.no") },
            ]}
          />
          {formData.open_to_whatsapp === "Yes" && (
            <div className="animate-slide-up">
              <FormField
                hiLabel={t("sectionE.whatsappNumber.hi")}
                enLabel={t("sectionE.whatsappNumber.en")}
                name="whatsapp_number"
                type="tel"
                value={formData.whatsapp_number}
                onChange={updateField("whatsapp_number")}
                error={errors.whatsapp_number}
                placeholder="10 अंकों का मोबाइल नंबर / 10-digit mobile number"
              />
            </div>
          )}
        </div>

        {/* ===== Section F — Open-Ended ===== */}
        <SectionHeader
          hiTitle={t("sectionF.title.hi")}
          enTitle={t("sectionF.title.en")}
          sectionNumber="F"
        />
        <div className="card p-5 mb-6 space-y-1">
          <FormField
            hiLabel={t("sectionF.otherProblems.hi")}
            enLabel={t("sectionF.otherProblems.en")}
            name="other_problems"
            type="textarea"
            value={formData.other_problems}
            onChange={updateField("other_problems")}
          />
          <FormField
            hiLabel={t("sectionF.oneThingToChange.hi")}
            enLabel={t("sectionF.oneThingToChange.en")}
            name="one_thing_to_change"
            type="textarea"
            value={formData.one_thing_to_change}
            onChange={updateField("one_thing_to_change")}
          />
        </div>

        {/* ===== Submit ===== */}
        {submitError && (
          <div className="mb-4 p-4 rounded-xl bg-warning-bg border border-amber-200 text-amber-800 text-sm animate-slide-up">
            ⚠️ {submitError}
          </div>
        )}

        {savedLocally && (
          <div className="mb-4 p-4 rounded-xl bg-success-bg border border-green-200 text-green-800 text-sm animate-slide-up">
            ✅ {tCommon("savedLocally")}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full text-lg"
          id="submit-survey-btn"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              {tCommon("submitting")}
            </>
          ) : (
            <>
              <span>✅</span>
              {tCommon("submit")} / Submit
            </>
          )}
        </button>
      </form>
    </div>
  );
}
