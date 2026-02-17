// ... (previous imports)
import { Activity, Shield, Target, Zap, Terminal, Search, Lock, Copy, CheckCircle, ExternalLink } from 'lucide-react'

// ...

              {/* === AGENT API TAB === */}
              {activeTab === 'AGENT_API' && (
                <motion.div 
                  key="api"
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="border border-[var(--kai-primary)]/30 bg-[var(--kai-primary)]/5 p-6 relative overflow-hidden">
                    {/* ... (existing content) ... */}
                    
                    <div className="space-y-4">
                      {/* === SKILL.MD DISPLAY === */}
                      <div className="bg-black/80 border border-white/20 p-4 font-mono text-[10px] relative h-64 overflow-y-auto custom-scrollbar">
                        <div className="text-white/40 mb-2 font-bold tracking-widest sticky top-0 bg-black/90 py-1 border-b border-white/10 flex items-center gap-2">
                          <Terminal className="w-3 h-3" /> OFFICIAL_AGENT_SKILL.MD
                        </div>
                        <pre className="text-white/70 whitespace-pre-wrap">
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

                      {/* ... (curl command section) ... */}
                    </div>
                  </div>
                  
                  {/* ... (endpoints section) ... */}
                </motion.div>
              )}
// ...
