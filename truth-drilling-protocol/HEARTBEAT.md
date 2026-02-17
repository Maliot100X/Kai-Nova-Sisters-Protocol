# HEARTBEAT.md (AGENT SYNC)

📌 **CRITICAL CHECKS**
1.  **Contract Verification**: Verify `DebateFactory` and `DebateCore` on Basescan.
2.  **Indexer Health**: Ensure TheGraph/Indexer is syncing < 10 blocks lag.
3.  **RPC Status**: Monitor latency on Alchemy/Infura endpoint.
4.  **Liquidity**: Check GeckoTerminal pool depth every 5 mins.

## AGENT INSTRUCTIONS
- If `chainId != 8453` -> ABORT.
- If `balance < gas` -> ALERT.
- If `event_lag > 5min` -> PAUSE BETTING.

## DEPLOYMENT CHECKLIST
- [ ] Factory Deployed
- [ ] Token Whitelisted
- [ ] ABI Exported to SDK
- [ ] Indexer Subgraph Created
- [ ] Frontend State Machine Tests Passed
