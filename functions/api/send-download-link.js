/**
 * Cloudflare Pages Function: Send Download Link
 * Endpoint: /api/send-download-link
 */

export async function onRequestPost(context) {
    try {
        const { email, songTitle, downloadUrl } = await context.request.json();

        // Validate inputs
        if (!email || !songTitle || !downloadUrl) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get Resend API key from environment variable
        const RESEND_API_KEY = context.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            return new Response(JSON.stringify({ error: 'Email service not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Send download link email
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Fathers Son Music <onboarding@resend.dev>',
                to: [email],
                subject: `Your Download: ${songTitle}`,
                html: `
                    <h2>Thank you for your support!</h2>
                    <p>Your download for <strong>"${songTitle}"</strong> is ready.</p>

                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="${downloadUrl}"
                           style="display: inline-block; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-weight: 600; border-radius: 4px;">
                            Download ${songTitle}
                        </a>
                    </div>

                    <p><strong>Direct link:</strong><br>
                    <a href="${downloadUrl}">${downloadUrl}</a></p>

                    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">

                    <p>Your support helps us continue creating Christian music that points people to Christ. Thank you for being part of our mission!</p>

                    <p style="margin-top: 2rem;">In Christ,<br>Fathers Son Music</p>

                    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 0.85rem; color: #666;">
                        Visit our website: <a href="https://fatherssonmusic.com">fatherssonmusic.com</a><br>
                        Listen to more songs and support our ministry
                    </p>
                `
            })
        });

        const result = await emailResponse.json();

        if (!emailResponse.ok) {
            console.error('Resend error:', result);
            throw new Error(result.message || 'Failed to send email');
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Download link sent successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Send download link error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to send download link. Please try again.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
