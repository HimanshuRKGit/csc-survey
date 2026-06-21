import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SurveyResponse {
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

export async function submitSurvey(data: SurveyResponse) {
  const { error } = await supabase
    .from('survey_responses')
    .insert([data]);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
