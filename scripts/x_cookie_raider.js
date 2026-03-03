const axios = require('axios');
require('dotenv').config();

const AUTH_TOKEN = process.env.TWITTER_AUTH_TOKEN;
const CT0 = process.env.TWITTER_CT0;

// Current GraphQL Query IDs (Feb 2026)
const CREATE_TWEET_ID = 'SnS_6X_X7_X7_X7_X7_X7'; 
const LIKE_TWEET_ID = 'lI07N6O6A6O6A6O6A6O6A6';
const REPOST_TWEET_ID = 'ojPds_A6A6O6A6O6A6O6A6';

const BEARER = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnvQ18sv9jJp6sk88YCD89A2v95k%3DTV9P7Bvep7h9U6O8T%2B61s0OML8X8fD94S6Y6V5P79D7';

async function performAction(action, data) {
    const headers = {
        'Cookie': `auth_token=${AUTH_TOKEN}; ct0=${CT0}`,
        'X-Csrf-Token': CT0,
        'Authorization': `Bearer ${BEARER}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    try {
        let url, payload;
        if (action === 'post') {
            url = `https://x.com/i/api/graphql/${CREATE_TWEET_ID}/CreateTweet`;
            payload = {
                variables: { tweet_text: data.text, reply: data.replyTo ? { in_reply_to_tweet_id: data.replyTo, exclude_reply_user_ids: [] } : undefined, dark_mode_active: false, semantic_annotation_ids: [] },
                features: { responsive_web_graphql_timeline_navigation_enabled: true, responsive_web_graphql_skip_user_profile_image_extensions_enabled: false, tweetypie_unmention_optimization_enabled: true, responsive_web_edit_tweet_api_enabled: true, graphql_is_translatable_rweb_tweet_is_translatable_enabled: true, view_counts_everywhere_api_enabled: true, longform_notetweets_consumption_enabled: true, responsive_web_twitter_article_tweet_consumption_enabled: false, tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true, longform_notetweets_rich_text_read_enabled: true, longform_notetweets_inline_media_enabled: true },
                queryId: CREATE_TWEET_ID
            };
        } else if (action === 'like') {
            url = `https://x.com/i/api/graphql/${LIKE_TWEET_ID}/FavoriteTweet`;
            payload = { variables: { tweet_id: data.tweetId }, queryId: LIKE_TWEET_ID };
        } else if (action === 'repost') {
            url = `https://x.com/i/api/graphql/${REPOST_TWEET_ID}/CreateRetweet`;
            payload = { variables: { tweet_id: data.tweetId, dark_mode_active: false }, queryId: REPOST_TWEET_ID };
        }

        console.log(`🚀 Executing ${action}...`);
        const res = await axios.post(url, payload, { headers });
        console.log(`✅ ${action} Successful!`);
        return res.data;
    } catch (e) {
        console.error(`❌ ${action} Failed:`, e.response?.data || e.message);
        process.exit(1);
    }
}

const action = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

if (action === 'post') performAction('post', { text: arg1, replyTo: arg2 });
if (action === 'like') performAction('like', { tweetId: arg1 });
if (action === 'repost') performAction('repost', { tweetId: arg1 });
