import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zftqgilqlbfjbawpcefe.supabase.co'
const supabaseAnonKey = 'sb_publishable_eIi6OyxtW2tNzWslf78FMA_iQf_C1Do'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
