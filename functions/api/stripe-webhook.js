/**
 * Cloudflare Pages Function: Stripe Webhook Handler
 * Endpoint: /api/stripe-webhook
 * Handles successful payments and sends download links
 */

export async function onRequestPost(context) {
    try {
        const signature = context.request.headers.get('stripe-signature');
        const STRIPE_SECRET_KEY = context.env.STRIPE_SECRET_KEY;
        const STRIPE_WEBHOOK_SECRET = context.env.STRIPE_WEBHOOK_SECRET;

        if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
            return new Response('Webhook configuration missing', { status: 500 });
        }

        // Get raw body for signature verification
        const body = await context.request.text();

        // Verify webhook signature using Stripe API
        const verifyResponse = await fetch('https://api.stripe.com/v1/webhook_endpoints/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'payload': body,
                'signature': signature,
                'secret': STRIPE_WEBHOOK_SECRET
            })
        });

        if (!verifyResponse.ok) {
            console.error('Webhook signature verification failed');
            return new Response('Signature verification failed', { status: 400 });
        }

        const event = JSON.parse(body);

        // Handle successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Get customer email and metadata
            const customerEmail = session.customer_details?.email || session.customer_email;
            const songTitle = session.metadata?.songTitle;
            const downloadUrl = session.metadata?.downloadUrl;

            console.log('Payment completed:', { customerEmail, songTitle, downloadUrl });

            // Only send download link if this was a song download (not a donation)
            if (songTitle && downloadUrl && customerEmail) {
                // Send download link via our API
                const RESEND_API_KEY = context.env.RESEND_API_KEY;

                if (RESEND_API_KEY) {
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${RESEND_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'Fathers Son Music <onboarding@resend.dev>',
                            to: [customerEmail],
                            subject: `Your Download: ${songTitle}`,
                            html: `
                                <h2>Thank you for your support!</h2>
                                <p>Your payment was successful and your download for <strong>"${songTitle}"</strong> is ready.</p>

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
                                    Visit our website: <a href="https://fatherssonmusic.pages.dev">fatherssonmusic.pages.dev</a><br>
                                    Listen to more songs and support our ministry
                                </p>
                            `
                        })
                    });

                    console.log('Download link sent to:', customerEmail);
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
