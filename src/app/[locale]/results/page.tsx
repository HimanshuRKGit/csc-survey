"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

interface SurveyRow {
  id: string;
  created_at: string;
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
  language_used: string;
  researcher_name: string;
}

export default function ResultsPage() {
  const t = useTranslations("results");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [data, setData] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof SurveyRow>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Check if already authenticated this session
  useEffect(() => {
    const auth = sessionStorage.getItem("csc-results-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/results", {
          headers: {
            "x-results-password": sessionStorage.getItem("csc-results-pwd") || "",
          },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.data || []);
        }
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (json.success) {
        sessionStorage.setItem("csc-results-auth", "true");
        sessionStorage.setItem("csc-results-pwd", password);
        setIsAuthenticated(true);
      } else {
        setPasswordError(t("wrongPassword"));
      }
    } catch {
      setPasswordError("Connection error. Please try again.");
    }
  };

  const handleSort = (field: keyof SurveyRow) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Summary stats
  const totalResponses = data.length;
  const openToPlatform = data.filter(
    (r) => r.open_to_new_platform && r.open_to_new_platform.toLowerCase().includes("yes")
  ).length;
  const hadDisputes = data.filter(
    (r) =>
      r.had_payment_dispute &&
      (r.had_payment_dispute.toLowerCase().includes("yes multiple") ||
        r.had_payment_dispute.toLowerCase().includes("yes once"))
  ).length;

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100dvh-56px)] flex items-center justify-center px-4 py-8">
        <div className="max-w-sm w-full animate-fade-in">
          <div className="card-elevated p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-navy-800 flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-navy-800 mb-2">{t("title")}</h1>
            <p className="text-sm text-text-muted mb-6">{t("passwordPrompt")}</p>

            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="mb-3"
                id="results-password-input"
                autoComplete="off"
              />
              {passwordError && (
                <p className="error-message mb-3 justify-center">{passwordError}</p>
              )}
              <button
                type="submit"
                className="btn-primary w-full"
                id="unlock-results-btn"
              >
                🔓 {t("unlock")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated view
  const displayColumns: { key: keyof SurveyRow; label: string }[] = [
    { key: "created_at", label: "Date / दिनांक" },
    { key: "researcher_name", label: "Researcher / शोधकर्ता" },
    { key: "center_name", label: "Center / केंद्र" },
    { key: "pincode", label: "Pincode / पिनकोड" },
    { key: "district_state", label: "District / जिला" },
    { key: "center_type", label: "Type / प्रकार" },
    { key: "operator_name", label: "Operator / ऑपरेटर" },
    { key: "main_service", label: "Main Service / मुख्य सेवा" },
    { key: "daily_customers", label: "Daily Customers / दैनिक ग्राहक" },
    { key: "current_bank_partner", label: "Bank / बैंक" },
    { key: "sells_insurance", label: "Insurance / बीमा" },
    { key: "payout_timing", label: "Payout / भुगतान" },
    { key: "had_payment_dispute", label: "Disputes / विवाद" },
    { key: "open_to_new_platform", label: "New Platform / नया प्लेटफ़ॉर्म" },
    { key: "open_to_whatsapp", label: "WhatsApp" },
    { key: "language_used", label: "Language / भाषा" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold text-navy-800 mb-6">{t("title")}</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-navy-800">{totalResponses}</p>
          <p className="text-sm text-text-muted mt-1">{t("totalResponses")}</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{openToPlatform}</p>
          <p className="text-sm text-text-muted mt-1">{t("openToNewPlatform")}</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-amber-600">{hadDisputes}</p>
          <p className="text-sm text-text-muted mt-1">{t("hadDisputes")}</p>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-12 text-text-muted">
          <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
          <p>{t("loading")}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="card p-8 text-center text-text-muted">
          <p className="text-lg">📭</p>
          <p className="mt-2">{t("noData")}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-800 text-white">
                  <th className="px-3 py-3 text-left font-medium text-xs whitespace-nowrap">#</th>
                  {displayColumns.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-left font-medium text-xs whitespace-nowrap cursor-pointer hover:bg-navy-700 transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortField === col.key && (
                          <span className="text-green-300">
                            {sortDir === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border/50 hover:bg-bg transition-colors ${
                      i % 2 === 0 ? "bg-surface" : "bg-bg-alt"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-text-muted">{i + 1}</td>
                    {displayColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-3 py-2.5 whitespace-nowrap max-w-[200px] truncate"
                        title={row[col.key] || "—"}
                      >
                        {col.key === "created_at"
                          ? new Date(row[col.key]).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : row[col.key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
