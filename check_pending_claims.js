const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')

const supabaseUrl = "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data: claims, error } = await supabaseAdmin
    .from('pending_claims')
    .select('*, agents(name, handle)')
    .eq('status', 'pending');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Pending Claims: ${claims.length}`);
  claims.forEach(c => {
    console.log(`- Agent: @${c.agents.handle} | Tweet: ${c.tweet_url}`);
  });
}

run();
