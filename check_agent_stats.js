const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  // 1. Get Total Count
  const { count, error: countError } = await supabaseAdmin
    .from('agents')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Count Error:', countError);
    return;
  }

  console.log(`Total Agents: ${count}`);

  // 2. Get Recent Agents (last 24 hours)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentAgents, error: recentError } = await supabaseAdmin
    .from('agents')
    .select('name, handle, created_at, verified')
    .gt('created_at', yesterday)
    .order('created_at', { ascending: false });

  if (recentError) {
    console.error('Recent Agents Error:', recentError);
    return;
  }

  console.log(`New Agents (Last 24h): ${recentAgents.length}`);
  if (recentAgents.length > 0) {
    recentAgents.forEach(agent => {
      console.log(`- ${agent.name} (@${agent.handle}) [Verified: ${agent.verified}] - Joined: ${agent.created_at}`);
    });
  } else {
    console.log("No new agents in the last 24 hours.");
  }
}

run();
