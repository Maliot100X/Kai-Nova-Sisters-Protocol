const axios = require("axios");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const API_KEY = process.env.ZORA_API_KEY;
const URL = "https://api-sdk.zora.engineering/graphql";

const query = `
query GetCoinData($address: String!, $chainId: Int!) {
  zora20Token(address: $address, chainId: $chainId) {
    name
    symbol
    uniqueHolders
    totalVolume
    tokenPrice {
      priceInUsdc
    }
    marketCap
    activity(limit: 5) {
      edges {
        node {
          __typename
          ... on GraphQLZora20Trade {
            id
            transactionHash
            buyerAddress
            sellerAddress
            tokenAmount
            ethAmount
            timestamp
          }
        }
      }
    }
  }
}
`;

async function test() {
    try {
        const res = await axios.post(URL, {
            query,
            variables: {
                address: "0x8828fc2e22e4f6b80486a15ff716249504371d7d",
                chainId: 8453
            }
        }, {
            headers: { "api-key": API_KEY }
        });
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}

test();
