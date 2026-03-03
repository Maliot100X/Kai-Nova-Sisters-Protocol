const axios = require('axios');

async function launch() {
  const PAYOUT_WALLET = "2Rztquu72LDUj5L5z7zXVHb8snMRCmPZQPKXJENKKcqg";
  const signature = "3hJpdcQw2zow52eFafqyhRWWpDVsxnq24gVXqvshPcFPLpjmQqKMEgHvTXX4W5Ek2YLZYuq4XmWJ11LbowbDwHDV";

  const metadata = {
    name: "FAIRHFUL Claw",
    symbol: "Faith",
    description: "$FAITH Token - Where faith meets finance. A community-driven cryptocurrency for believers who understand that with faith, all things are possible. HODL with prayer! 💎🙌",
    imageUrl: "https://m2dum5b0kmx1kump.public.blob.vercel-storage.com/uploads/8bd3b4ee-4190-4db2-b9cd-8755d64889c0.jpg",
    agentId: "basecrab-kai-faith",
    agentName: "BaseCrab Kai",
    walletAddress: PAYOUT_WALLET,
    txSignature: signature,
    devBuySol: 0.01
  };

  try {
    console.log("Retrying token launch on ClawPump with new agentId...");
    const response = await axios.post('https://clawpump.tech/api/launch/self-funded', metadata);
    console.log("Launch Result:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("Launch Failed:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

launch();
