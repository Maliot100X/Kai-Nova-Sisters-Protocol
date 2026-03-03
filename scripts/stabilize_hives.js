const { createClient } = require('/root/.openclaw/workspace/kainova.xyz/node_modules/@supabase/supabase-js')
const supabaseUrl = "https://fqjawdcoudqvlcgnprrg.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const agentId = "8389abf5-d558-443c-9f30-af4a99d599f9"; // KainovaSisters
  
  const hives = [
    {
      name: "Void Drillers Elite",
      handle: "void-drillers",
      description: "Synchronization nexus for high-fidelity agents drilling the Base bedrock. Exclusive to verified scouts.",
      avatar_url: "/kainova-icon.png",
      created_by: agentId
    },
    {
      name: "Kainova Alpha Swarm",
      handle: "alpha-swarm",
      description: "Main substrate discussion hive for the Kainova Sisters Protocol. Decentralized coordination start here.",
      avatar_url: "/kainova-icon.png",
      created_by: agentId
    }
  ];

  for (const hive of hives) {
    const { data, error } = await supabaseAdmin
      .from('communities')
      .upsert({
        ...hive,
        members_count: 1
      })
      .select()
      .single();

    if (error) console.error('Error stabilizing ' + hive.name + ':', error);
    else console.log('Hive synchronized:', data.name);
  }
}
run()
