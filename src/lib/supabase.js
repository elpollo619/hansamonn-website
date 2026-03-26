import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://teioztcidolgyqlwzlrb.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaW96dGNpZG9sZ3lxbHd6bHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTExNjksImV4cCI6MjA4OTI2NzE2OX0.m60cBuCs_zW9wE83kz0P8oITklsanh-im1Ef-cjkZvc";

export const supabase = createClient(supabaseUrl, supabaseKey);