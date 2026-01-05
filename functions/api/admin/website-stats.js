/**
 * Cloudflare Pages Function: Get Website Analytics
 * Endpoint: /api/admin/website-stats
 * Fetches analytics from Cloudflare Web Analytics
 */

export async function onRequestGet(context) {
    try {
        // Simple authentication check
        const authHeader = context.request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const CLOUDFLARE_ACCOUNT_ID = context.env.CLOUDFLARE_ACCOUNT_ID;
        const CLOUDFLARE_API_TOKEN = context.env.CLOUDFLARE_API_TOKEN;
        const CLOUDFLARE_ZONE_ID = context.env.CLOUDFLARE_ZONE_ID;

        // If Cloudflare API credentials are not configured, return mock/sample data
        if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
            console.log('Cloudflare Analytics API not configured, using database statistics');

            // Get statistics from our database instead
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

            // Get total submissions in last 30 days (proxy for engagement)
            const last30DaysResult = await context.env.DB.prepare(
                `SELECT COUNT(*) as count FROM submissions WHERE created_at >= ?`
            ).bind(thirtyDaysAgo.toISOString()).all();

            const last7DaysResult = await context.env.DB.prepare(
                `SELECT COUNT(*) as count FROM submissions WHERE created_at >= ?`
            ).bind(sevenDaysAgo.toISOString()).all();

            // Get stream counts
            const streamResult = await context.env.DB.prepare(
                `SELECT COUNT(*) as count FROM submissions WHERE form_type = 'Song Stream'`
            ).all();

            // Get download counts
            const downloadResult = await context.env.DB.prepare(
                `SELECT COUNT(*) as count FROM submissions WHERE form_type LIKE '%Download%'`
            ).all();

            const last30DaysCount = last30DaysResult.results[0]?.count || 0;
            const last7DaysCount = last7DaysResult.results[0]?.count || 0;
            const totalStreams = streamResult.results[0]?.count || 0;
            const totalDownloads = downloadResult.results[0]?.count || 0;

            return new Response(JSON.stringify({
                success: true,
                stats: {
                    totalEngagements: last30DaysCount,
                    last7Days: last7DaysCount,
                    totalStreams: totalStreams,
                    totalDownloads: totalDownloads
                },
                source: 'database'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Fetch analytics from Cloudflare GraphQL API
        const graphqlQuery = `
            query {
                viewer {
                    zones(filter: { zoneTag: "${CLOUDFLARE_ZONE_ID}" }) {
                        httpRequests1dGroups(
                            limit: 30
                            filter: { date_geq: "${getDateDaysAgo(30)}", date_lt: "${getDateDaysAgo(0)}" }
                        ) {
                            sum {
                                requests
                                pageViews
                            }
                            uniq {
                                uniques
                            }
                            dimensions {
                                date
                            }
                        }
                    }
                }
            }
        `;

        const analyticsResponse = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: graphqlQuery })
        });

        if (!analyticsResponse.ok) {
            throw new Error('Failed to fetch analytics from Cloudflare');
        }

        const analyticsData = await analyticsResponse.json();

        // Process the analytics data
        const httpRequestsData = analyticsData.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];

        let totalRequests = 0;
        let totalPageViews = 0;
        let totalUniques = 0;
        let last7DaysUniques = 0;

        const sevenDaysAgo = getDateDaysAgo(7);

        httpRequestsData.forEach(day => {
            totalRequests += day.sum.requests;
            totalPageViews += day.sum.pageViews;
            totalUniques += day.uniq.uniques;

            if (day.dimensions.date >= sevenDaysAgo) {
                last7DaysUniques += day.uniq.uniques;
            }
        });

        return new Response(JSON.stringify({
            success: true,
            stats: {
                uniqueVisitors30Days: totalUniques,
                uniqueVisitors7Days: last7DaysUniques,
                pageViews30Days: totalPageViews,
                totalRequests30Days: totalRequests
            },
            source: 'cloudflare'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get website stats error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to fetch website statistics',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Helper function to get date N days ago in YYYY-MM-DD format
function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}
