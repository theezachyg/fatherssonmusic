/**
 * Cloudflare Pages Function: Update Submission Status
 * Endpoint: /api/admin/update-status
 */

export async function onRequestPost(context) {
    try {
        // Simple authentication check
        const authHeader = context.request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { id, status } = await context.request.json();

        // Validate status
        if (!['new', 'read'].includes(status)) {
            return new Response(JSON.stringify({ error: 'Invalid status' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update submission status
        await context.env.DB.prepare(
            'UPDATE submissions SET status = ? WHERE id = ?'
        ).bind(status, id).run();

        return new Response(JSON.stringify({
            success: true,
            message: 'Status updated'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Update status error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update status' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
