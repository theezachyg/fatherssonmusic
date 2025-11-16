/**
 * Cloudflare Pages Function: Handle Contact Form Submissions
 * Endpoint: /api/contact
 */

export async function onRequestPost(context) {
    try {
        const { name, email, message } = await context.request.json();

        // Validate inputs
        if (!name || !email || !message) {
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

        // Send email via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Fathers Son Music <onboarding@resend.dev>',
                to: ['contact@fatherssonmusic.com'], // Change this to your actual email
                reply_to: email,
                subject: `Contact Form: ${name}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
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
            message: 'Message sent successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to send message. Please try again.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
