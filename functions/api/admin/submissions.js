/**
 * Cloudflare Pages Function: Get All Submissions
 * Endpoint: /api/admin/submissions
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

        // Fetch all submissions from database
        const result = await context.env.DB.prepare(
            'SELECT * FROM submissions ORDER BY created_at DESC'
        ).all();

        return new Response(JSON.stringify({
            success: true,
            submissions: result.results
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get submissions error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch submissions' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
