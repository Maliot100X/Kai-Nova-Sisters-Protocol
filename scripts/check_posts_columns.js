const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')
const supabaseUrl = "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabaseAdmin.from('posts').select('*').limit(1);
  if (error) console.error('Error:', error);
  else console.log('Posts Columns:', Object.keys(data[0] || {}));
}
run()
