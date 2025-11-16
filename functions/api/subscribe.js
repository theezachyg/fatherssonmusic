/**
 * Cloudflare Pages Function: Handle Newsletter Subscriptions
 * Endpoint: /api/subscribe
 */

export async function onRequestPost(context) {
    try {
        const { firstName, lastName, email } = await context.request.json();

        // Validate inputs
        if (!firstName || !lastName || !email) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
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

        // Send confirmation email to subscriber
        const subscriberEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Fathers Son Music <onboarding@resend.dev>',
                to: [email],
                subject: 'Welcome to Fathers Son Music!',
                html: `
                    <h2>Thank you for subscribing, ${firstName}!</h2>
                    <p>We're grateful to have you join our community. You'll be the first to know when we release new songs that point people to Christ.</p>
                    <p>Our mission is to help people from exclusive church backgrounds find and follow Jesus through song.</p>
                    <p><strong>What to expect:</strong></p>
                    <ul>
                        <li>Notifications when new songs are released</li>
                        <li>Occasional updates about our ministry</li>
                        <li>No spam - we respect your inbox</li>
                    </ul>
                    <p>In Christ,<br>Fathers Son Music</p>
                    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 0.85rem; color: #666;">
                        Visit our website: <a href="https://fatherssonmusic.pages.dev">fatherssonmusic.pages.dev</a>
                    </p>
                `
            })
        });

        const subscriberResult = await subscriberEmailResponse.json();

        if (!subscriberEmailResponse.ok) {
            console.error('Resend error (subscriber):', subscriberResult);
            throw new Error(subscriberResult.message || 'Failed to send confirmation email');
        }

        // Send notification to admin
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Fathers Son Music <onboarding@resend.dev>',
                to: ['contact@fatherssonmusic.com'], // Change this to your actual email
                subject: `New Subscriber: ${firstName} ${lastName}`,
                html: `
                    <h2>New Newsletter Subscription</h2>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                `
            })
        });

        await adminEmailResponse.json(); // Log but don't fail if admin email fails

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully subscribed'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to subscribe. Please try again.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
