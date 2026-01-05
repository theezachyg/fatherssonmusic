/**
 * Cloudflare Pages Function: Get Song Statistics
 * Endpoint: /api/admin/song-stats
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

        const CONTENTFUL_SPACE_ID = context.env.CONTENTFUL_SPACE_ID;
        const CONTENTFUL_ACCESS_TOKEN = context.env.CONTENTFUL_ACCESS_TOKEN;

        if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
            return new Response(JSON.stringify({ error: 'Contentful not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Fetch all songs from Contentful
        const contentfulResponse = await fetch(
            `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=song`,
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (!contentfulResponse.ok) {
            throw new Error('Failed to fetch songs from Contentful');
        }

        const contentfulData = await contentfulResponse.json();

        // Build song list
        const songs = contentfulData.items
            .filter(item => item.fields.songTitle)
            .map(item => ({
                title: item.fields.songTitle,
                published: item.fields.publishStatus || false
            }));

        // Fetch all download submissions from database
        const downloadResult = await context.env.DB.prepare(
            `SELECT additional_info, COUNT(*) as count
             FROM submissions
             WHERE form_type LIKE '%Download%'
             GROUP BY additional_info`
        ).all();

        // Count bulk downloads
        const bulkDownloadResult = await context.env.DB.prepare(
            `SELECT COUNT(*) as count
             FROM submissions
             WHERE form_type = 'Bulk Song Download - Paid' OR additional_info LIKE '%All Songs%'`
        ).all();

        const bulkDownloadCount = bulkDownloadResult.results[0]?.count || 0;

        // Fetch all stream submissions from database
        const streamResult = await context.env.DB.prepare(
            `SELECT additional_info, COUNT(*) as count
             FROM submissions
             WHERE form_type = 'Song Stream'
             GROUP BY additional_info`
        ).all();

        // Build stats for each song
        const songStats = songs.map(song => {
            // Count individual downloads for this song
            const individualDownloads = downloadResult.results
                .filter(row => row.additional_info && row.additional_info.includes(song.title))
                .reduce((sum, row) => sum + row.count, 0);

            // Total downloads = individual downloads + bulk downloads
            const totalDownloads = individualDownloads + bulkDownloadCount;

            // Count streams for this song
            const streams = streamResult.results
                .filter(row => row.additional_info && row.additional_info.includes(song.title))
                .reduce((sum, row) => sum + row.count, 0);

            return {
                title: song.title,
                published: song.published,
                downloads: totalDownloads,
                streams: streams
            };
        });

        // Sort by total engagement (downloads + streams) descending
        songStats.sort((a, b) => (b.downloads + b.streams) - (a.downloads + a.streams));

        return new Response(JSON.stringify({
            success: true,
            stats: songStats,
            totalSongs: songs.length
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get song stats error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to fetch song statistics',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
