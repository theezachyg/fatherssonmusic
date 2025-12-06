/**
 * Cloudflare Pages Function: Send Bulk Download Links
 * Endpoint: /api/send-bulk-download-links
 * Sends download links for all available songs in a single email
 */

export async function onRequestPost(context) {
    try {
        const { firstName, lastName, email } = await context.request.json();

        // Validate inputs
        if (!firstName || !lastName || !email) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get environment variables
        const RESEND_API_KEY = context.env.RESEND_API_KEY;
        const CONTENTFUL_SPACE_ID = context.env.CONTENTFUL_SPACE_ID;
        const CONTENTFUL_ACCESS_TOKEN = context.env.CONTENTFUL_ACCESS_TOKEN;

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            return new Response(JSON.stringify({ error: 'Email service not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
            console.error('Contentful credentials not configured');
            return new Response(JSON.stringify({ error: 'Content service not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Fetch all songs from Contentful
        const contentfulResponse = await fetch(
            `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=song`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!contentfulResponse.ok) {
            throw new Error('Failed to fetch songs from Contentful');
        }

        const contentfulData = await contentfulResponse.json();

        // Filter songs that have downloads enabled and get download URLs
        const songsWithDownloads = [];

        for (const item of contentfulData.items) {
            const fields = item.fields;

            // Check if downloads are enabled and download file exists
            if (fields.publishStatus && fields.downloadsToggle && fields.downloadAudioFile) {
                // Get the asset ID for the download file
                const assetId = fields.downloadAudioFile.sys.id;

                // Find the asset in the includes
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

        if (songsWithDownloads.length === 0) {
            return new Response(JSON.stringify({ error: 'No songs available for download' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Build the email HTML with all download links
        const songLinksHtml = songsWithDownloads.map((song, index) => `
            <div style="margin: 1.5rem 0; padding: 1rem; background: #f9f9f9; border-radius: 8px;">
                <h3 style="margin: 0 0 0.5rem 0; color: #333;">${index + 1}. ${song.title}</h3>
                ${song.description ? `<p style="margin: 0 0 0.75rem 0; color: #666; font-size: 0.9rem;">${song.description}</p>` : ''}
                <a href="${song.url}"
                   download
                   style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 0.9rem;">
                    <i class="fas fa-download"></i> Download ${song.title}
                </a>
            </div>
        `).join('');

        // Send email with all download links
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Fathers Son Music <downloads@fatherssonmusic.com>',
                to: [email],
                subject: `Your Complete Song Collection - ${songsWithDownloads.length} Songs`,
                html: `
                    <h2>Thank you for your support, ${firstName}!</h2>
                    <p>Your complete collection of <strong>${songsWithDownloads.length} songs</strong> is ready to download.</p>

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

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
            console.error('Resend API error response:', {
                status: emailResponse.status,
                statusText: emailResponse.statusText,
                result: emailResult
            });
            throw new Error(`Resend error: ${emailResult.message || emailResponse.statusText || 'Failed to send email'}`);
        }

        console.log('Bulk download email sent successfully:', emailResult);

        // Save to D1 database
        try {
            await context.env.DB.prepare(
                'INSERT INTO submissions (first_name, last_name, email, form_type, additional_info) VALUES (?, ?, ?, ?, ?)'
            ).bind(
                firstName,
                lastName,
                email,
                'Bulk Song Download - Free',
                `${songsWithDownloads.length} songs: ${songsWithDownloads.map(s => s.title).join(', ')}`
            ).run();
        } catch (dbError) {
            // Don't fail the request if database logging fails
            console.error('Database logging error:', dbError);
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Download links for ${songsWithDownloads.length} songs sent successfully`,
            songCount: songsWithDownloads.length
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Send bulk download links error:', error);
        console.error('Error stack:', error.stack);
        return new Response(JSON.stringify({
            error: 'Failed to send download links. Please try again.',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
