import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type TestRequest = {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "pending" | "completed" | "cancelled";
  sales_person_id: string;
  phone_number: string;
};
