import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://himgdusrbzzuvpzbqsne.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbWdkdXNyYnp6dXZwemJxc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDMzNTEsImV4cCI6MjEwMDk3OTM1MX0.xfslDoZ1EY3BnMX1umujTDqf0JRcMOR87nwtJqXwNbg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
