import { createClient } from "@supabase/supabase-js";
import conf from "../config/config";
const supabaseUrl = conf.supabase.supabaseUrl
const supabaseAnonKey = conf.supabase.supabaseAnonKey
const supabase = createClient(supabaseUrl,supabaseAnonKey);


export default supabase;