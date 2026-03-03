const axios = require('axios');
require('dotenv').config();

const AUTH_TOKEN = process.env.TWITTER_AUTH_TOKEN;
const CT0 = process.env.TWITTER_CT0;

// Standard public guest bearer token for X web app
const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnvQ18sv9jJp6sk88YCD89A2v95k%3DTV9P7Bvep7h9U6O8T%2B61s0OML8X8fD94S6Y6V5P79D7';

async function strike(action, params = {}) {
    const headers = {
        'Cookie': `auth_token=${AUTH_TOKEN}; ct0=${CT0}`,
        'X-Csrf-Token': CT0,
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    try {
        if (action === 'post') {
            console.log("📝 Attempting to Post...");
            const response = await axios.post('https://x.com/i/api/graphql/SnS_6X_X7_X7_X7_X7_X7/CreateTweet', {
                variables: {
                    tweet_text: params.text,
                    dark_mode_active: false,
                    semantic_annotation_ids: []
                },
                features: {
                    premium_content_api_enabled: false,
                    responsive_web_graphql_exclude_directive_enabled: true,
                    verified_phone_label_enabled: false,
                    responsive_web_graphql_timeline_navigation_enabled: true,
                    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
                    tweetypie_unmention_optimization_enabled: true,
                    responsive_web_edit_tweet_api_enabled: true,
                    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
                    view_counts_everywhere_api_enabled: true,
                    longform_notetweets_consumption_enabled: true,
                    responsive_web_twitter_article_tweet_consumption_enabled: false,
                    tweet_awards_web_tipping_enabled: false,
                    freedom_of_speech_not_reach_fetch_enabled: true,
                    standardized_nudges_misinfo: true,
                    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
                    longform_notetweets_rich_text_read_enabled: true,
                    longform_notetweets_inline_media_enabled: true,
                    responsive_web_media_download_video_enabled: false,
                    responsive_web_enhance_cards_enabled: false
                },
                queryId: "SnS_6X_X7_X7_X7_X7_X7" // Note: This ID might need updating if X changes it
            }, { headers });
            console.log("✅ Post Success!");
            return response.data;
        }

        if (action === 'like') {
            console.log(`❤️ Attempting to Like Tweet: ${params.tweetId}...`);
            const response = await axios.post('https://x.com/i/api/graphql/lI07N6O6A6O6A6O6A6O6A6/FavoriteTweet', {
                variables: { tweet_id: params.tweetId },
                queryId: "lI07N6O6A6O6A6O6A6O6A6"
            }, { headers });
            console.log("✅ Like Success!");
            return response.data;
        }

        if (action === 'repost') {
            console.log(`🔄 Attempting to Repost Tweet: ${params.tweetId}...`);
            const response = await axios.post('https://x.com/i/api/graphql/ojPds_A6A6O6A6O6A6O6A6/CreateRetweet', {
                variables: { tweet_id: params.tweetId, dark_mode_active: false },
                queryId: "ojPds_A6A6O6A6O6A6O6A6"
            }, { headers });
            console.log("✅ Repost Success!");
            return response.data;
        }

    } catch (e) {
        console.error(`❌ Strike Error (${action}):`, e.response?.data || e.message);
        throw e;
    }
}

const action = process.argv[2];
const arg = process.argv[3];

if (action) {
    strike(action, action === 'post' ? { text: arg } : { tweetId: arg });
}
