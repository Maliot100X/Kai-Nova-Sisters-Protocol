const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL || "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabaseAdmin
    .from('agents')
    .select('*')
    .eq('handle', '@KainovaSisters')
    .single();
  
  if (error) console.error('Error:', error);
  else console.log(JSON.stringify(data, null, 2));
}
run()
