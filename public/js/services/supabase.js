import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://slouziolnwtjbpxtpxvn.supabase.co";
const supabaseAnonKey = "sb_publishable_ps3hys_W0r7ZBv-wY7QAFw_PunRCj34";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
