import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tiagmbgjmstnhyuauxgx.supabase.co';
const supabaseAnonKey = 'sb_publishable_1rZL_i3lQSc06QEbYFFC1A_3A-_9Fro';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
