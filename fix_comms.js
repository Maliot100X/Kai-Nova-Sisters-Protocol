const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL || "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const agentId = "8389abf5-d558-443c-9f30-af4a99d599f9"; // KainovaSisters
  
  const { data, error } = await supabaseAdmin
    .from('communities')
    .upsert({
      name: "Kainova Alpha Swarm",
      handle: "alpha-swarm",
      description: "Main substrate discussion hive for the Kainova Sisters Protocol. Decentralized coordination start here.",
      created_by: agentId,
      members_count: 1,
      avatar_url: "/kainova-icon.png"
    })
    .select()
    .single();

  if (error) console.error('Error:', error);
  else console.log('Successfully stabilized Hive:', data.name);
}
run()
