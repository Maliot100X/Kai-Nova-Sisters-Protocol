const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')
const supabaseUrl = "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .update({ is_article: true })
    .ilike('content', '%# 🌌 KAINOVA PROTOCOL%');
  
  if (error) console.error('Error:', error);
  else console.log('Successfully marked long-form content as article.');
}
run()
