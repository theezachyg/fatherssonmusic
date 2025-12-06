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
            const firstName = session.metadata?.firstName || '';
            const lastName = session.metadata?.lastName || '';
            const songTitle = session.metadata?.songTitle;
            const downloadUrl = session.metadata?.downloadUrl;
            const isBulkDownload = session.metadata?.bulkDownload === 'true';

            console.log('Payment completed:', { customerEmail, songTitle, downloadUrl, isBulkDownload });

            const RESEND_API_KEY = context.env.RESEND_API_KEY;

            // Handle bulk download
            if (isBulkDownload && customerEmail && RESEND_API_KEY) {
                const CONTENTFUL_SPACE_ID = context.env.CONTENTFUL_SPACE_ID;
                const CONTENTFUL_ACCESS_TOKEN = context.env.CONTENTFUL_ACCESS_TOKEN;

                if (CONTENTFUL_SPACE_ID && CONTENTFUL_ACCESS_TOKEN) {
                    try {
                        // Fetch all songs from Contentful
                        const contentfulResponse = await fetch(
                            `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=song`,
                            { headers: { 'Content-Type': 'application/json' } }
                        );

                        if (contentfulResponse.ok) {
                            const contentfulData = await contentfulResponse.json();
                            const songsWithDownloads = [];

                            for (const item of contentfulData.items) {
                                const fields = item.fields;
                                if (fields.publishStatus && fields.downloadsToggle && fields.downloadAudioFile) {
                                    const assetId = fields.downloadAudioFile.sys.id;
                                    const asset = contentfulData.includes?.Asset?.find(a => a.sys.id === assetId);
                                    if (asset && asset.fields.file) {
                                        songsWithDownloads.push({
                                            title: fields.songTitle,
                                            url: 'https:' + asset.fields.file.url,
                                            description: fields.shortDescription || fields.songDescription || ''
                                        });
                                    }
                                }
                            }

                            if (songsWithDownloads.length > 0) {
                                const songLinksHtml = songsWithDownloads.map((song, index) => `
                                    <div style="margin: 1.5rem 0; padding: 1rem; background: #f9f9f9; border-radius: 8px;">
                                        <h3 style="margin: 0 0 0.5rem 0; color: #333;">${index + 1}. ${song.title}</h3>
                                        ${song.description ? `<p style="margin: 0 0 0.75rem 0; color: #666; font-size: 0.9rem;">${song.description}</p>` : ''}
                                        <a href="${song.url}" download style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 0.9rem;">
                                            Download ${song.title}
                                        </a>
                                    </div>
                                `).join('');

                                await fetch('https://api.resend.com/emails', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        from: 'Fathers Son Music <downloads@fatherssonmusic.com>',
                                        to: [customerEmail],
                                        subject: `Your Complete Song Collection - ${songsWithDownloads.length} Songs`,
                                        html: `
                                            <h2>Thank you for your support${firstName ? `, ${firstName}` : ''}!</h2>
                                            <p>Your payment was successful and your complete collection of <strong>${songsWithDownloads.length} songs</strong> is ready to download.</p>
                                            <p style="color: #666; font-size: 0.95rem;">Click the download button for each song below to save them to your device:</p>
                                            ${songLinksHtml}
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

                                console.log('Bulk download links sent to:', customerEmail);
                            }
                        }
                    } catch (error) {
                        console.error('Bulk download error:', error);
                    }
                }
            }
            // Handle single song download
            else if (songTitle && downloadUrl && customerEmail && RESEND_API_KEY) {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Fathers Son Music <downloads@fatherssonmusic.com>',
                        to: [customerEmail],
                        subject: `Your Download: ${songTitle}`,
                        html: `
                            <h2>Thank you for your support${firstName ? `, ${firstName}` : ''}!</h2>
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
                                Visit our website: <a href="https://fatherssonmusic.com">fatherssonmusic.com</a><br>
                                Listen to more songs and support our ministry
                            </p>
                        `
                    })
                });

                console.log('Download link sent to:', customerEmail);
            }

            // Save to D1 database
            if (customerEmail) {
                try {
                    // Determine the type of transaction
                    const isDonation = !songTitle && !isBulkDownload;
                    const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0';

                    let formType, additionalInfo;
                    if (isBulkDownload) {
                        formType = 'Bulk Song Download - Paid';
                        additionalInfo = `All Songs - $${amount}`;
                    } else if (songTitle) {
                        formType = 'Song Download - Paid';
                        additionalInfo = `${songTitle} - $${amount}`;
                    } else {
                        formType = 'Donation';
                        additionalInfo = `$${amount}`;
                    }

                    await context.env.DB.prepare(
                        'INSERT INTO submissions (first_name, last_name, email, form_type, additional_info) VALUES (?, ?, ?, ?, ?)'
                    ).bind(
                        firstName || '',
                        lastName || '',
                        customerEmail,
                        formType,
                        additionalInfo
                    ).run();
                } catch (dbError) {
                    // Don't fail the webhook if database logging fails
                    console.error('Database logging error:', dbError);
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
