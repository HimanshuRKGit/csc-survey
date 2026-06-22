"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Row {
  id: string;
  created_at: string;
  center_name: string | null;
  location_area: string | null;
  pincode: string | null;
  district_state: string | null;
  tier_level: string | null;
  center_type: string | null;
  operator_name: string | null;
  operator_gender: string | null;
  operator_age: string | null;
  years_in_business: string | null;
  main_service: string | null;
  daily_customers: string | null;
  current_bank_partner: string | null;
  commission_per_card_loan: string | null;
  sells_insurance: string | null;
  insurance_commission: string | null;
  payout_timing: string | null;
  had_payment_dispute: string | null;
  dispute_resolution_time: string | null;
  biggest_payout_problem: string | null;
  open_to_new_platform: string | null;
  most_important_factor: string | null;
  open_to_whatsapp: string | null;
  whatsapp_number: string | null;
  other_problems: string | null;
  one_thing_to_change: string | null;
  language_used: string | null;
  researcher_name: string | null;
}

interface Filters {
  district_state: string;
  tier_level: string;
  center_type: string;
  date_from: string;
  date_to: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function countBy(
  rows: Row[],
  field: keyof Row
): { name: string; count: number }[] {
  const map: Record<string, number> = {};
  for (const row of rows) {
    const val = (row[field] as string | null) || "—";
    if (val === "—") continue;
    map[val] = (map[val] || 0) + 1;
  }
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function pct(n: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

function applyFilters(rows: Row[], f: Filters): Row[] {
  return rows.filter((r) => {
    if (f.district_state && r.district_state !== f.district_state) return false;
    if (f.tier_level && r.tier_level !== f.tier_level) return false;
    if (f.center_type && r.center_type !== f.center_type) return false;
    if (f.date_from && new Date(r.created_at) < new Date(f.date_from))
      return false;
    if (
      f.date_to &&
      new Date(r.created_at) > new Date(f.date_to + "T23:59:59")
    )
      return false;
    return true;
  });
}

const CHART_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
];
const GREEN = "#22c55e";
const RED = "#ef4444";
const ORANGE = "#f97316";
const BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";

// ── Shared UI ─────────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  colorClass,
}: {
  label: string;
  value: string | number;
  sub?: string;
  colorClass: string;
}) {
  return (
    <div className={`rounded-xl p-5 border-2 ${colorClass}`}>
      <div className="text-4xl font-bold">{value}</div>
      {sub && <div className="text-sm mt-1 opacity-75">{sub}</div>}
      <div className="text-xs font-medium mt-2 opacity-60 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function SimpleBar({
  data,
  color = BLUE,
  height = 260,
  unit = "",
}: {
  data: { name: string; count: number }[];
  color?: string;
  height?: number;
  unit?: string;
}) {
  if (data.length === 0)
    return <p className="text-gray-400 text-sm italic py-4">No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          allowDecimals={false}
          unit={unit}
        />
        <Tooltip formatter={(v) => [`${v}${unit}`, "Count"]} />
        <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SimplePie({ data }: { data: { name: string; count: number }[] }) {
  if (data.length === 0)
    return <p className="text-gray-400 text-sm italic py-4">No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={85}
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TextList({
  items,
  empty = "No responses yet",
}: {
  items: string[];
  empty?: string;
}) {
  if (items.length === 0)
    return <p className="text-gray-400 text-sm italic">{empty}</p>;
  return (
    <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
      {items.map((item, i) => (
        <div
          key={i}
          className="text-sm p-2.5 bg-gray-50 rounded-lg border-l-4 border-gray-200 text-gray-700 leading-snug"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-gray-500 mb-3">{children}</h3>
  );
}

// ── Password Gate ──────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "GroMo2026") {
      onUnlock(pw);
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#f9fafb" }}
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-xl font-bold text-gray-800">Survey Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Internal analytics — password required
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

function Dashboard({ password }: { password: string }) {
  const [allRows, setAllRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState<Filters>({
    district_state: "",
    tier_level: "",
    center_type: "",
    date_from: "",
    date_to: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/dashboard", {
        headers: { "x-dashboard-password": password },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setAllRows(json.data ?? []);
      setLastUpdated(new Date());
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rows = useMemo(() => applyFilters(allRows, filters), [allRows, filters]);
  const total = rows.length;

  // Filter option lists (always from full dataset)
  const districtOpts = useMemo(
    () =>
      [...new Set(allRows.map((r) => r.district_state).filter(Boolean))].sort() as string[],
    [allRows]
  );
  const tierOpts = useMemo(
    () =>
      [...new Set(allRows.map((r) => r.tier_level).filter(Boolean))].sort() as string[],
    [allRows]
  );
  const centerTypeOpts = useMemo(
    () =>
      [...new Set(allRows.map((r) => r.center_type).filter(Boolean))].sort() as string[],
    [allRows]
  );

  const hasFilter =
    filters.district_state ||
    filters.tier_level ||
    filters.center_type ||
    filters.date_from ||
    filters.date_to;

  // ── Section 1: Summary ───────────────────────────────────────────────────
  const openToPlatformCount = rows.filter(
    (r) => r.open_to_new_platform === "Yes definitely"
  ).length;
  const hadDisputeCount = rows.filter(
    (r) =>
      r.had_payment_dispute === "Yes multiple times" ||
      r.had_payment_dispute === "Yes once or twice"
  ).length;
  const whatsappCount = rows.filter((r) => r.open_to_whatsapp === "Yes").length;

  // ── Section 2: Geographic ────────────────────────────────────────────────
  const byDistrict = useMemo(
    () => countBy(rows, "district_state").slice(0, 10),
    [rows]
  );
  const byTier = useMemo(() => countBy(rows, "tier_level"), [rows]);

  // ── Section 3: Center Type ───────────────────────────────────────────────
  const byCenterType = useMemo(() => countBy(rows, "center_type"), [rows]);
  const centerCrossTab = useMemo(() => {
    const types = [
      ...new Set(rows.map((r) => r.center_type).filter(Boolean)),
    ] as string[];
    return types.map((type) => {
      const sub = rows.filter((r) => r.center_type === type);
      const n = sub.length;
      const dispute = sub.filter(
        (r) =>
          r.had_payment_dispute === "Yes multiple times" ||
          r.had_payment_dispute === "Yes once or twice"
      ).length;
      const open = sub.filter(
        (r) => r.open_to_new_platform === "Yes definitely"
      ).length;
      const commSamples = sub
        .map((r) => r.commission_per_card_loan)
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
      return {
        type,
        n,
        disputePct: pct(dispute, n),
        openPct: pct(open, n),
        commSamples: commSamples || "—",
      };
    });
  }, [rows]);

  // ── Section 4: Payout Reliability ───────────────────────────────────────
  const payoutTiming = useMemo(() => countBy(rows, "payout_timing"), [rows]);
  const disputeDist = useMemo(
    () => countBy(rows, "had_payment_dispute"),
    [rows]
  );
  const biggestProblems = useMemo(
    () => rows.map((r) => r.biggest_payout_problem).filter(Boolean) as string[],
    [rows]
  );

  // ── Section 5: Earnings ──────────────────────────────────────────────────
  const mainServiceFreq = useMemo(
    () => countBy(rows, "main_service").slice(0, 10),
    [rows]
  );
  const sellsInsurance = useMemo(() => countBy(rows, "sells_insurance"), [rows]);
  const cardCommissions = useMemo(
    () =>
      rows.map((r) => r.commission_per_card_loan).filter(Boolean) as string[],
    [rows]
  );
  const insuranceCommissions = useMemo(
    () =>
      rows.map((r) => r.insurance_commission).filter(Boolean) as string[],
    [rows]
  );

  // ── Section 6: Platform Switching ───────────────────────────────────────
  const platformDist = useMemo(
    () => countBy(rows, "open_to_new_platform"),
    [rows]
  );
  const importantFactors = useMemo(
    () =>
      rows.map((r) => r.most_important_factor).filter(Boolean) as string[],
    [rows]
  );
  const disputeVsPlatform = useMemo(() => {
    const disputeVals = ["Yes multiple times", "Yes once or twice"];
    const withDispute = rows.filter((r) =>
      disputeVals.includes(r.had_payment_dispute || "")
    );
    const noDispute = rows.filter(
      (r) => !disputeVals.includes(r.had_payment_dispute || "")
    );
    const openWith = withDispute.filter(
      (r) => r.open_to_new_platform === "Yes definitely"
    ).length;
    const openNo = noDispute.filter(
      (r) => r.open_to_new_platform === "Yes definitely"
    ).length;
    return [
      {
        name: "Had Dispute",
        pct: withDispute.length
          ? Math.round((openWith / withDispute.length) * 100)
          : 0,
        n: withDispute.length,
      },
      {
        name: "No Dispute",
        pct: noDispute.length
          ? Math.round((openNo / noDispute.length) * 100)
          : 0,
        n: noDispute.length,
      },
    ];
  }, [rows]);

  // ── Section 7: WhatsApp ──────────────────────────────────────────────────
  const whatsappContacts = useMemo(
    () =>
      rows
        .filter((r) => r.open_to_whatsapp === "Yes" && r.whatsapp_number)
        .map((r) => ({
          center: r.center_name || "—",
          district: r.district_state || "—",
          number: r.whatsapp_number!,
        })),
    [rows]
  );

  const exportCSV = () => {
    const lines = [
      "Center Name,District / State,WhatsApp Number",
      ...whatsappContacts.map(
        (c) => `"${c.center}","${c.district}","${c.number}"`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whatsapp-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Section 8: Open-Ended ────────────────────────────────────────────────
  const otherProblems = useMemo(
    () =>
      rows
        .filter((r) => r.other_problems)
        .map((r) => ({
          text: r.other_problems!,
          center: r.center_name || "—",
          district: r.district_state || "—",
        })),
    [rows]
  );
  const oneThingToChange = useMemo(
    () =>
      rows
        .filter((r) => r.one_thing_to_change)
        .map((r) => ({
          text: r.one_thing_to_change!,
          center: r.center_name || "—",
          district: r.district_state || "—",
        })),
    [rows]
  );

  // ── Section 9: Data Quality ──────────────────────────────────────────────
  const byResearcher = useMemo(() => countBy(rows, "researcher_name"), [rows]);
  const byLanguage = useMemo(() => countBy(rows, "language_used"), [rows]);
  const byDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of rows) {
      const d = r.created_at.split("T")[0];
      map[d] = (map[d] || 0) + 1;
    }
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rows]);

  // ── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f9fafb" }}
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-gray-500 text-sm">Loading survey data…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f9fafb" }}
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error: {fetchError}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              📊 CSC Survey Dashboard
            </h1>
            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-0.5">
                Last refreshed: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                District / State
              </label>
              <select
                value={filters.district_state}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, district_state: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Districts</option>
                {districtOpts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Tier Level
              </label>
              <select
                value={filters.tier_level}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, tier_level: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Tiers</option>
                {tierOpts.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Center Type
              </label>
              <select
                value={filters.center_type}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, center_type: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Types</option>
                {centerTypeOpts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, date_from: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, date_to: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {hasFilter && (
              <button
                onClick={() =>
                  setFilters({
                    district_state: "",
                    tier_level: "",
                    center_type: "",
                    date_from: "",
                    date_to: "",
                  })
                }
                className="px-3 py-2 text-sm text-red-500 hover:text-red-700 font-medium"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
          {hasFilter && (
            <p className="text-xs text-blue-500 mt-2 font-medium">
              Showing {total} of {allRows.length} responses
            </p>
          )}
        </div>

        {/* ── Section 1: Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Responses"
            value={total}
            colorClass="border-blue-200 bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Open to New Platform"
            value={openToPlatformCount}
            sub={`${pct(openToPlatformCount, total)} of total`}
            colorClass="border-green-200 bg-green-50 text-green-700"
          />
          <StatCard
            label="Had Payment Dispute"
            value={hadDisputeCount}
            sub={`${pct(hadDisputeCount, total)} of total`}
            colorClass="border-orange-200 bg-orange-50 text-orange-700"
          />
          <StatCard
            label="Open to WhatsApp Follow-up"
            value={whatsappCount}
            sub={`${pct(whatsappCount, total)} of total`}
            colorClass="border-green-200 bg-green-50 text-green-700"
          />
        </div>

        {/* ── Section 2: Geographic ── */}
        <SectionCard title="Section 2 — Geographic Breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Subhead>Top 10 Districts / States by Responses</Subhead>
              <SimpleBar data={byDistrict} color={BLUE} />
            </div>
            <div>
              <Subhead>Tier Level Distribution</Subhead>
              <SimplePie data={byTier} />
            </div>
          </div>
        </SectionCard>

        {/* ── Section 3: Center Type ── */}
        <SectionCard title="Section 3 — Center Type Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Subhead>Responses by Center Type</Subhead>
              <SimpleBar data={byCenterType} color={PURPLE} height={220} />
            </div>
            <div>
              <Subhead>Cross-tab by Center Type</Subhead>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                      <th className="text-left p-2 border-b">Type</th>
                      <th className="text-right p-2 border-b">N</th>
                      <th className="text-right p-2 border-b">Dispute %</th>
                      <th className="text-right p-2 border-b">Open Platform %</th>
                      <th className="text-left p-2 border-b">Commission Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {centerCrossTab.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-3 text-gray-400 italic text-center"
                        >
                          No data yet
                        </td>
                      </tr>
                    ) : (
                      centerCrossTab.map((r) => (
                        <tr key={r.type} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{r.type}</td>
                          <td className="p-2 text-right text-gray-600">{r.n}</td>
                          <td className="p-2 text-right text-orange-600 font-medium">
                            {r.disputePct}
                          </td>
                          <td className="p-2 text-right text-green-600 font-medium">
                            {r.openPct}
                          </td>
                          <td className="p-2 text-gray-500">{r.commSamples}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 4: Payout Reliability ── */}
        <SectionCard title="Section 4 — Payout Reliability Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div>
              <Subhead>Payout Timing Distribution</Subhead>
              <SimpleBar data={payoutTiming} color={ORANGE} height={220} />
            </div>
            <div>
              <Subhead>Payment Dispute History</Subhead>
              <SimpleBar data={disputeDist} color={RED} height={220} />
            </div>
          </div>
          <Subhead>
            Biggest Payout Problems — open text ({biggestProblems.length}{" "}
            responses)
          </Subhead>
          <TextList items={biggestProblems} />
        </SectionCard>

        {/* ── Section 5: Earnings & Service Mix ── */}
        <SectionCard title="Section 5 — Earnings & Service Mix">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div>
              <Subhead>Most Common Main Services</Subhead>
              <SimpleBar data={mainServiceFreq} color={BLUE} height={240} />
            </div>
            <div>
              <Subhead>Sells Insurance</Subhead>
              <SimplePie data={sellsInsurance} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Subhead>
                Card / Loan Commission Values ({cardCommissions.length}{" "}
                responses)
              </Subhead>
              <TextList items={cardCommissions} />
            </div>
            <div>
              <Subhead>
                Insurance Commission Values ({insuranceCommissions.length}{" "}
                responses)
              </Subhead>
              <TextList items={insuranceCommissions} />
            </div>
          </div>
        </SectionCard>

        {/* ── Section 6: Platform Switching ── */}
        <SectionCard title="Section 6 — Platform Switching Readiness">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div>
              <Subhead>Open to New Platform</Subhead>
              <SimpleBar data={platformDist} color={GREEN} height={220} />
            </div>
            <div>
              <Subhead>
                % Open to Platform: Dispute vs No Dispute
              </Subhead>
              <p className="text-xs text-gray-400 mb-3">
                Are operators who experienced disputes more likely to switch?
              </p>
              {disputeVsPlatform[0]?.n === 0 &&
              disputeVsPlatform[1]?.n === 0 ? (
                <p className="text-gray-400 text-sm italic">No data yet</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={disputeVsPlatform}
                      margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        unit="%"
                        domain={[0, 100]}
                      />
                      <Tooltip
                        formatter={(v) => [`${v}%`, "Open to Platform"]}
                      />
                      <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                        {disputeVsPlatform.map((_, i) => (
                          <Cell
                            key={i}
                            fill={i === 0 ? ORANGE : BLUE}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {disputeVsPlatform.map((d) => (
                      <div
                        key={d.name}
                        className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200"
                      >
                        <div className="text-xs text-gray-500 font-medium">
                          {d.name}
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mt-1">
                          {d.pct}%
                        </div>
                        <div className="text-xs text-gray-400">
                          n={d.n}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <Subhead>
            Most Important Factor — open text ({importantFactors.length}{" "}
            responses)
          </Subhead>
          <TextList items={importantFactors} />
        </SectionCard>

        {/* ── Section 7: WhatsApp Outreach ── */}
        <SectionCard title="Section 7 — Network & Outreach Readiness">
          <div className="flex items-center gap-4 mb-5">
            <div className="border-2 border-green-200 bg-green-50 rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-green-700">
                {whatsappCount}
              </div>
              <div className="text-sm text-green-600 mt-1">
                {pct(whatsappCount, total)} open to WhatsApp
              </div>
            </div>
            {whatsappContacts.length > 0 && (
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                ⬇️ Export CSV
              </button>
            )}
          </div>
          <Subhead>
            WhatsApp Contact List ({whatsappContacts.length} contacts)
          </Subhead>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left p-2 border-b">#</th>
                  <th className="text-left p-2 border-b">Center Name</th>
                  <th className="text-left p-2 border-b">District / State</th>
                  <th className="text-left p-2 border-b">WhatsApp Number</th>
                </tr>
              </thead>
              <tbody>
                {whatsappContacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-gray-400 italic text-center"
                    >
                      No contacts yet
                    </td>
                  </tr>
                ) : (
                  whatsappContacts.map((c, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-gray-400 text-xs">{i + 1}</td>
                      <td className="p-2 font-medium text-gray-800">
                        {c.center}
                      </td>
                      <td className="p-2 text-gray-500">{c.district}</td>
                      <td className="p-2 font-mono text-green-700 font-semibold">
                        {c.number}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── Section 8: Open-Ended ── */}
        <SectionCard title="Section 8 — Open-Ended Insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Subhead>
                Other Problems ({otherProblems.length} responses)
              </Subhead>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {otherProblems.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No responses yet</p>
                ) : (
                  otherProblems.map((item, i) => (
                    <div
                      key={i}
                      className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-300"
                    >
                      <p className="text-sm text-gray-800">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.center} · {item.district}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <Subhead>
                One Thing to Change ({oneThingToChange.length} responses)
              </Subhead>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {oneThingToChange.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No responses yet</p>
                ) : (
                  oneThingToChange.map((item, i) => (
                    <div
                      key={i}
                      className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-300"
                    >
                      <p className="text-sm text-gray-800">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.center} · {item.district}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 9: Data Quality ── */}
        <SectionCard title="Section 9 — Researcher & Data Quality Tracking">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <Subhead>Responses by Researcher</Subhead>
              {byResearcher.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {byResearcher.map((r) => (
                    <div
                      key={r.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <span
                        className="text-sm text-gray-700 truncate"
                        title={r.name}
                      >
                        {r.name}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.round(
                                (r.count / (byResearcher[0]?.count || 1)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-blue-700 w-5 text-right">
                          {r.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Subhead>Language Used</Subhead>
              <SimplePie data={byLanguage} />
            </div>
            <div>
              <Subhead>Collection Pace by Date</Subhead>
              {byDate.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={byDate}
                    margin={{ top: 4, right: 10, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={BLUE}
                      fill="#dbeafe"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </SectionCard>

        <p className="text-center text-xs text-gray-400 pb-4">
          CSC Field Survey Dashboard · Internal Use Only · {allRows.length} total
          responses
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [password, setPassword] = useState<string | null>(null);
  return password ? (
    <Dashboard password={password} />
  ) : (
    <PasswordGate onUnlock={setPassword} />
  );
}
