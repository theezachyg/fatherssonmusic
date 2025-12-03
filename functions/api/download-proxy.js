/**
 * Cloudflare Pages Function: Proxy MP3 downloads with forced Content-Disposition
 * Endpoint: /api/download-proxy
 *
 * This proxies Contentful MP3 files and forces them to download instead of opening in browser
 */

export async function onRequestGet(context) {
    try {
        const url = new URL(context.request.url);
        const fileUrl = url.searchParams.get('url');
        const filename = url.searchParams.get('filename') || 'song.mp3';

        if (!fileUrl) {
            return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Fetch the file from Contentful
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
        }

        // Get the file as a blob
        const blob = await response.blob();

        // Return with forced download headers
        return new Response(blob, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'public, max-age=31536000',
            }
        });

    } catch (error) {
        console.error('Download proxy error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to download file',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
