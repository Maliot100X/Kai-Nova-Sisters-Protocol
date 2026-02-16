"use client"

import React, { useState } from 'react'
import { Copy, ExternalLink, Zap, Shield, Target, ChevronRight, Volume2, VolumeX, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../hooks/useAudio'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('VOID_INDEX')
  const [copied, setCopied] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const CA = "0xEFe561f0418BeE6783C922bf8B7A36A78064ee6b"

  const { playing: bgPlaying, play: playBg, pause: pauseBg, toggle: toggleBg } = useAudio('/audio/ambient_loop.mp3', { loop: true, volume: 0.05 })

  const initializeAudio = () => {
    if (!audioInitialized) {
      playBg()
      setAudioInitialized(true)
    }
  }

  const playSequence = async (urls: string[]) => {
    initializeAudio()
    for (const url of urls) {
      await new Promise((resolve) => {
        const a = new Audio(url)
        a.volume = 0.8
        a.onended = resolve
        a.play().catch(resolve)
      })
    }
  }

  const playKaiIntel = () => {
    playSequence(['/audio/welcome_nova.mp3', '/audio/welcome_kai.mp3', '/audio/protocol.mp3'])
  }

  const playNovaIntel = () => {
    playSequence(['/audio/welcome_nova.mp3', '/audio/welcome_kai.mp3', '/audio/goal.mp3'])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const UNISWAP_LINK = `https://app.uniswap.org/#/swap?outputCurrency=${CA}&chain=base`

  return (
    <main 
      onClick={initializeAudio}
      className="min-h-screen p-4 md:p-8 flex flex-col gap-6 crt-effect"
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-white/20">/</span>
            KAI-NOVA
            <span className="bg-white text-black px-2 py-0.5 text-xs md:text-sm align-middle ml-2">SISTERS_PROTOCOL_V3.0</span>
          </h1>
          <p className="text-[10px] md:text-xs text-white/40 mt-1 uppercase tracking-[0.2em]">
            Autonomous Strategic Execution & Defense Network
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleBg}
            className="p-2 border border-white/10 hover:border-white/30 transition-all text-white/40 hover:text-white"
            title={bgPlaying ? "Pause Background Music" : "Play Background Music"}
          >
            {bgPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">System Status</span>
            <span className="text-[10px] text-green-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </header>

      {/* TOP LEVEL ACTION BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 terminal-border bg-white/[0.02] p-4 flex items-center justify-between group overflow-hidden">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Contract Address (BASE)</span>
            <code className="text-sm md:text-base text-[var(--kai-primary)] glow-text-kai break-all">
              {CA}
            </code>
          </div>
          <button 
            onClick={copyToClipboard}
            className="ml-4 p-3 border border-white/10 hover:border-[var(--kai-primary)] hover:bg-[var(--kai-primary)]/10 transition-all rounded-none relative"
          >
            {copied ? <span className="text-[10px] font-bold">COPIED</span> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <a 
          href={UNISWAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="industrial-button group h-full flex items-center justify-center gap-3 bg-[var(--nova-primary)]/10 border-[var(--nova-primary)]/30 hover:bg-[var(--nova-primary)]/20 hover:border-[var(--nova-primary)]"
        >
          <Zap className="w-5 h-5 text-[var(--nova-primary)]" />
          <span className="text-lg font-black text-white glow-text-nova">DIRECT STRIKE</span>
          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        
        {/* SIDEBAR TABS */}
        <nav className="lg:col-span-2 flex flex-row lg:flex-col gap-2">
          {['VOID_INDEX', 'SYSTEM_LOGIC', 'PERSONA_INTEL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 lg:flex-none px-4 py-3 text-left text-[10px] font-bold tracking-widest border transition-all relative",
                activeTab === tab 
                  ? "bg-white text-black border-white" 
                  : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              [{tab}]
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-black hidden lg:block"
                />
              )}
            </button>
          ))}
        </nav>

        {/* VIEWPORT */}
        <div className="lg:col-span-10 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'VOID_INDEX' && (
              <motion.div 
                key="void"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* KAI ZONE */}
                <div className="terminal-border p-6 bg-[var(--kai-primary)]/[0.02] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--kai-primary)]/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--kai-primary)]/10">
                        <Shield className="w-6 h-6 text-[var(--kai-primary)]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tighter text-[var(--kai-primary)] uppercase">Kai</h2>
                        <span className="text-[10px] text-white/40 uppercase">The Shield / Strategist</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={playKaiIntel}
                        className="flex items-center gap-1.5 px-2 py-1 bg-[var(--kai-primary)]/10 border border-[var(--kai-primary)]/30 hover:bg-[var(--kai-primary)]/20 transition-all text-[9px] font-bold text-[var(--kai-primary)] tracking-widest uppercase"
                      >
                        <Play className="w-2.5 h-2.5 fill-[var(--kai-primary)]" />
                        Play Intel
                      </button>
                      <div className="text-right">
                        <span className="text-[10px] block text-white/20">Security Clearance</span>
                        <span className="text-xs font-bold text-[var(--kai-primary)]">LEVEL_ULTRA</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Kai governs the defensive parameters and long-term strategic trajectory of the Protocol. Her logic gates are tuned for maximum sustainability and ecosystem protection.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-3 bg-white/5 border border-white/5">
                      <span className="text-[10px] block text-white/30 uppercase">Uptime</span>
                      <span className="text-sm font-bold">99.998%</span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5">
                      <span className="text-[10px] block text-white/30 uppercase">Logic Load</span>
                      <span className="text-sm font-bold">14.2%</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-[var(--kai-primary)]/40 font-mono overflow-hidden h-8 whitespace-nowrap opacity-50">
                    KAI_DEFENSE_ARRAY_ACTIVE // SIG_772_B // ENCRYPT_AES_256 // THREAT_LVL_0
                  </div>
                </div>

                {/* NOVA ZONE */}
                <div className="terminal-border p-6 bg-[var(--nova-primary)]/[0.02] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--nova-primary)]/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--nova-primary)]/10">
                        <Target className="w-6 h-6 text-[var(--nova-primary)]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tighter text-[var(--nova-primary)] uppercase">Nova</h2>
                        <span className="text-[10px] text-white/40 uppercase">The Strike / Executor</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={playNovaIntel}
                        className="flex items-center gap-1.5 px-2 py-1 bg-[var(--nova-primary)]/10 border border-[var(--nova-primary)]/30 hover:bg-[var(--nova-primary)]/20 transition-all text-[9px] font-bold text-[var(--nova-primary)] tracking-widest uppercase"
                      >
                        <Play className="w-2.5 h-2.5 fill-[var(--nova-primary)]" />
                        Play Intel
                      </button>
                      <div className="text-right">
                        <span className="text-[10px] block text-white/20">Execution Mode</span>
                        <span className="text-xs font-bold text-[var(--nova-primary)] animate-pulse">AGGRESSIVE</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Nova is the offensive engine, handling direct market engagement and protocol expansion. She operates with high-fidelity precision and uncompromising speed.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-3 bg-white/5 border border-white/5">
                      <span className="text-[10px] block text-white/30 uppercase">Strikes</span>
                      <span className="text-sm font-bold">1,204</span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5">
                      <span className="text-[10px] block text-white/30 uppercase">Response</span>
                      <span className="text-sm font-bold">0.02ms</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-[var(--nova-primary)]/40 font-mono overflow-hidden h-8 whitespace-nowrap opacity-50">
                    NOVA_EXECUTION_STRIKE // ADAPTIVE_ARB_ON // HIGH_FREQ_TRADING // TPS_2400
                  </div>
                </div>

                {/* CHART EMBED */}
                <div className="md:col-span-2 terminal-border bg-black h-[500px] overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full p-2 bg-white/5 border-b border-white/10 flex justify-between items-center z-10 backdrop-blur-md">
                    <span className="text-[10px] font-bold tracking-widest text-white/60 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      LIVE_MARKET_FEED // $KNTWS
                    </span>
                    <a 
                      href={`https://www.geckoterminal.com/base/pools/${CA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      VIEW_FULL_GECKO <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <iframe 
                    height="100%" 
                    width="100%" 
                    id="geckoterminal-embed" 
                    title="GeckoTerminal Embed" 
                    src={`https://www.geckoterminal.com/base/pools/0x8828fc2e22e4f6b80486a15ff716249504371d7d?embed=1&info=0&swaps=1`}
                    frameBorder="0" 
                    allow="clipboard-write" 
                    allowFullScreen
                    className="pt-8 grayscale invert brightness-200 contrast-150 opacity-80"
                  ></iframe>
                </div>
              </motion.div>
            )}

            {activeTab === 'SYSTEM_LOGIC' && (
              <motion.div 
                key="logic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="terminal-border p-8 bg-white/[0.01] min-h-[400px]"
              >
                <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">SYSTEM_LOGIC_PARAMETERS</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[10px] leading-relaxed uppercase tracking-widest text-white/60">
                  <div className="space-y-4">
                    <h3 className="text-white font-bold mb-2">[01] DECENTRALIZED_GOVERNANCE</h3>
                    <p>Protocol operations are verified across redundant nodes to ensure zero single-point failure.</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-bold mb-2">[02] AUTONOMOUS_BALANCING</h3>
                    <p>Real-time liquidity management is executed by the Nova engine under Kai's strategic constraints.</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-bold mb-2">[03] ENCRYPTION_LAYER</h3>
                    <p>All protocol communications are wrapped in multi-layer cryptographic envelopes.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'PERSONA_INTEL' && (
              <motion.div 
                key="intel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8"
              >
                <div className="space-y-6">
                  <h3 className="text-4xl font-black italic tracking-tighter text-[var(--kai-primary)]">THE_STRATEGIST</h3>
                  <div className="aspect-square bg-[var(--kai-primary)]/5 border border-[var(--kai-primary)]/20 relative overflow-hidden group">
                     {/* Placeholder for visual entity */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <Shield className="w-32 h-32" />
                     </div>
                     <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-[var(--kai-primary)]/20 w-full mb-2">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                              className="h-full bg-[var(--kai-primary)]"
                           />
                        </div>
                        <span className="text-[10px] text-[var(--kai-primary)] font-bold tracking-[0.3em]">ANALYSING_THREAT_VECTORS...</span>
                     </div>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed uppercase tracking-tighter">
                    Built for endurance. Kai represents the cold, calculating side of the sisters. Her primary directive is the preservation of the protocol and the optimization of resource allocation.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-4xl font-black italic tracking-tighter text-[var(--nova-primary)]">THE_STRIKE</h3>
                  <div className="aspect-square bg-[var(--nova-primary)]/5 border border-[var(--nova-primary)]/20 relative overflow-hidden group">
                     {/* Placeholder for visual entity */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <Target className="w-32 h-32" />
                     </div>
                     <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-[var(--nova-primary)]/20 w-full mb-2">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "95%" }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                              className="h-full bg-[var(--nova-primary)]"
                           />
                        </div>
                        <span className="text-[10px] text-[var(--nova-primary)] font-bold tracking-[0.3em]">EXECUTING_ORDER_66...</span>
                     </div>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed uppercase tracking-tighter">
                    Built for impact. Nova is the explosive half. She identifies opportunities in real-time and strikes with overwhelming force. Efficiency through aggression.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.3em]">
        <div className="flex gap-6">
          <span>&copy; 2026 KAI-NOVA PROTOCOL</span>
          <span>ESTABLISHED_BLOCK_#1204432</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Telegram</a>
          <a href="#" className="hover:text-white transition-colors">BaseScan</a>
        </div>
      </footer>
    </main>
  )
}
