/**
 * Cloudflare Pages Function: Admin Login
 * Endpoint: /api/admin/login
 */

export async function onRequestPost(context) {
    try {
        const { password } = await context.request.json();

        console.log('Login attempt received');

        // Get admin password from environment variable
        const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD not configured');
            return new Response(JSON.stringify({ error: 'Admin not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Password provided:', password ? 'Yes' : 'No');
        console.log('Password match:', password === ADMIN_PASSWORD);

        // Check password
        if (password === ADMIN_PASSWORD) {
            // Generate a simple token using crypto API (available in Workers)
            const tokenString = `${Date.now()}-${Math.random()}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(tokenString);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            console.log('Login successful, token generated');

            return new Response(JSON.stringify({
                success: true,
                token: token
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            console.log('Invalid password provided');
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid password'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Login error:', error);
        console.error('Error details:', error.message, error.stack);
        return new Response(JSON.stringify({
            error: 'Login failed',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
