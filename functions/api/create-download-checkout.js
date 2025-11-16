/**
 * Cloudflare Pages Function: Create Stripe Checkout for Song Downloads
 * Endpoint: /api/create-download-checkout
 */

export async function onRequestPost(context) {
    try {
        const { amount, songTitle, downloadUrl } = await context.request.json();

        // Validate inputs
        if (!amount || amount < 1) {
            return new Response(JSON.stringify({ error: 'Invalid amount' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!songTitle || !downloadUrl) {
            return new Response(JSON.stringify({ error: 'Song title and download URL required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get Stripe secret key from environment variable
        const STRIPE_SECRET_KEY = context.env.STRIPE_SECRET_KEY;

        if (!STRIPE_SECRET_KEY) {
            return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create Stripe checkout session using fetch API
        const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'mode': 'payment',
                'line_items[0][price_data][currency]': 'usd',
                'line_items[0][price_data][product_data][name]': `Download: ${songTitle}`,
                'line_items[0][price_data][product_data][description]': 'High-quality MP3 download + support for Fathers Son Music ministry',
                'line_items[0][price_data][unit_amount]': (amount * 100).toString(),
                'line_items[0][quantity]': '1',
                'success_url': `${new URL(context.request.url).origin}/success.html?session_id={CHECKOUT_SESSION_ID}&song=${encodeURIComponent(songTitle)}`,
                'cancel_url': `${new URL(context.request.url).origin}/#songs`,
                'metadata[songTitle]': songTitle,
                'metadata[downloadUrl]': downloadUrl
            })
        });

        const sessionData = await session.json();

        if (!session.ok) {
            throw new Error(sessionData.error?.message || 'Failed to create checkout session');
        }

        return new Response(JSON.stringify({ sessionId: sessionData.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
