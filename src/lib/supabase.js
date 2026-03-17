import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://teioztcidolgyqlwzlrb.supabase.co";

const supabaseKey = "sb_publishable_-vspIyBvb2esWOXrSC1XeA_junMh81-";

export const supabase = createClient(supabaseUrl, supabaseKey);