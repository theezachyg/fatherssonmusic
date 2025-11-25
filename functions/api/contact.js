/**
 * Cloudflare Pages Function: Handle Contact Form Submissions
 * Endpoint: /api/contact
 */

export async function onRequestPost(context) {
    try {
        const { firstName, lastName, email, message } = await context.request.json();

        // Validate inputs
        if (!firstName || !lastName || !email || !message) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get Resend API key from environment variable
        const RESEND_API_KEY = context.env.RESEND_API_KEY;

        // Send email via Resend (if configured)
        if (RESEND_API_KEY) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Fathers Son Music <onboarding@resend.dev>',
                        to: ['contact@fatherssonmusic.com'],
                        reply_to: email,
                        subject: `Contact Form: ${firstName} ${lastName}`,
                        html: `
                            <h2>New Contact Form Submission</h2>
                            <p><strong>From:</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Message:</strong></p>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        `
                    })
                });

                const result = await emailResponse.json();

                if (!emailResponse.ok) {
                    console.error('Resend error status:', emailResponse.status);
                    console.error('Resend error response:', JSON.stringify(result));
                    console.error('Resend API key exists:', !!RESEND_API_KEY);
                    // Don't fail - still log to Google Sheets
                }
            } catch (emailError) {
                console.error('Failed to send email via Resend:', emailError);
                // Don't fail - still log to Google Sheets
            }
        } else {
            console.warn('RESEND_API_KEY not configured - skipping email');
        }

        // Save to D1 database
        try {
            await context.env.DB.prepare(
                'INSERT INTO submissions (first_name, last_name, email, form_type, additional_info) VALUES (?, ?, ?, ?, ?)'
            ).bind(
                firstName,
                lastName,
                email,
                'Contact Form',
                message.substring(0, 500)
            ).run();
        } catch (dbError) {
            // Don't fail the request if database logging fails
            console.error('Database logging error:', dbError);
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
        console.error('Error details:', error.message, error.stack);
        return new Response(JSON.stringify({
            error: 'Failed to send message. Please try again.',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
