/**
 * Cloudflare Pages Function: Track Song Stream
 * Endpoint: /api/track-stream
 */

export async function onRequestPost(context) {
    try {
        const { songTitle } = await context.request.json();

        // Validate input
        if (!songTitle) {
            return new Response(JSON.stringify({ error: 'Song title required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Save stream event to D1 database
        try {
            await context.env.DB.prepare(
                'INSERT INTO submissions (first_name, last_name, email, form_type, additional_info) VALUES (?, ?, ?, ?, ?)'
            ).bind(
                'Anonymous',
                'User',
                'stream@fatherssonmusic.com',
                'Song Stream',
                songTitle
            ).run();

            console.log('Stream tracked for song:', songTitle);
        } catch (dbError) {
            console.error('Database logging error:', dbError);
            // Don't fail the request if database logging fails
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Stream tracked'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Track stream error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to track stream'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
