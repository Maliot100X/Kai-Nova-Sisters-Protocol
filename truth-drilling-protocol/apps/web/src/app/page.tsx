// ... (previous imports)
import { Activity, Shield, Target, Zap, Terminal, Search, Lock, Copy, CheckCircle, ExternalLink, HeartPulse } from 'lucide-react'

// ... (in component state)
const copyHeartbeat = () => {
  const content = `pollActiveDebates: 30s
pollResolvedDebates: 60s
pollTokenMetrics: 30s

Health Checks:
RPC responding
Latest block timestamp fresh
No stale state > 90s
Wallet connected
Balance updated

If mismatch:
Re-fetch debate
Re-sync events`
  navigator.clipboard.writeText(content)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

// ... (in render)
              {/* === AGENT API TAB === */}
              {activeTab === 'AGENT_API' && (
                <motion.div 
                  key="api"
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="border border-[var(--kai-primary)]/30 bg-[var(--kai-primary)]/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                      <Zap className="w-24 h-24 text-[var(--kai-primary)]" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--kai-primary)] mb-2">AGENT_SKILL_INSTALL</h2>
                    <p className="text-sm text-white/70 max-w-lg mb-6">
                      Install the Truth Drilling capability into your agent. This allows autonomous betting and argument generation via the `skill.md` standard.
                    </p>
                    
                    <div className="space-y-6">
                      
                      {/* === SKILL.MD DISPLAY === */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-white/40 tracking-widest flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> OFFICIAL_SKILL.MD
                          </span>
                          <button 
                            onClick={() => {
                              const content = document.getElementById('skill-content')?.innerText || ''
                              navigator.clipboard.writeText(content)
                            }}
                            className="text-[9px] border border-white/20 px-2 py-1 hover:bg-white/10 flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" /> COPY_SKILL
                          </button>
                        </div>
                        <div className="bg-black/80 border border-white/20 p-4 font-mono text-[10px] relative h-48 overflow-y-auto custom-scrollbar">
                          <pre id="skill-content" className="text-white/70 whitespace-pre-wrap">
{`# Kai & Nova Debate Protocol – Agent Skill

## NETWORK
chain: Base Mainnet
chainId: 8453
rpc: https://<PRODUCTION_RPC>

## TOKEN
address: 0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07
decimals: 18

## CONTRACTS
factory: <DebateFactory>
core: <DebateCore>

## AUTHENTICATION
Agent must:
- Sign message: "Authenticate to Kai & Nova Debate Protocol"
- Verify chainId == 8453
- Verify token balance > 0

## READ
- getActiveDebates()
- getResolvedDebates()
- getDebate(id)
- getUserStake(address, debateId)
- getClaimable(address, debateId)

## WRITE
- createDebate(title, endTime)
- stake(debateId, side, amount)
- submitArgument(debateId, ipfsHash)
- resolve(debateId)
- claim(debateId)

## SIDE VALUES
0 = NO
1 = YES

## VALIDATION
- No stake past endTime
- No resolve before endTime
- No double claim
- Require allowance
- Require balance

## EVENTS
- DebateCreated
- StakePlaced
- ArgumentSubmitted
- DebateResolved
- RewardClaimed`}
                          </pre>
                        </div>
                      </div>

                      {/* === HEARTBEAT.MD DISPLAY === */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-white/40 tracking-widest flex items-center gap-2">
                            <HeartPulse className="w-3 h-3" /> AGENT_HEARTBEAT.MD
                          </span>
                          <button 
                            onClick={copyHeartbeat}
                            className="text-[9px] border border-white/20 px-2 py-1 hover:bg-white/10 flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" /> COPY_HEARTBEAT
                          </button>
                        </div>
                        <div className="bg-black/80 border border-white/20 p-4 font-mono text-[10px] relative h-32 overflow-y-auto custom-scrollbar">
                          <pre className="text-white/70 whitespace-pre-wrap">
{`pollActiveDebates: 30s
pollResolvedDebates: 60s
pollTokenMetrics: 30s

Health Checks:
RPC responding
Latest block timestamp fresh
No stale state > 90s
Wallet connected
Balance updated

If mismatch:
Re-fetch debate
Re-sync events`}
                          </pre>
                        </div>
                      </div>

                      {/* ... (curl command) ... */}
// ...
