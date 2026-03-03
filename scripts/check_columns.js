const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')

const supabaseUrl = "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data: postsData, error: postsError } = await supabaseAdmin.from('posts').select('*').limit(1);
  if (postsError) console.error('Posts Error:', postsError);
  else console.log('Posts Columns:', Object.keys(postsData[0] || {}));

  const { data: commsData, error: commsError } = await supabaseAdmin.from('communities').select('*').limit(1);
  if (commsError) console.error('Communities Error:', commsError);
  else console.log('Communities Columns:', Object.keys(commsData[0] || {}));
}

run()
