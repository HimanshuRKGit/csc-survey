import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DASHBOARD_PASSWORD = "GroMo2026";

export async function GET(request: Request) {
  const password = request.headers.get("x-dashboard-password") || "";
  if (password !== DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: `Missing env vars: ${!supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : ""} ${!supabaseKey ? "SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY" : ""}`.trim() },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: `Supabase: ${error.message} (code: ${error.code})` },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
