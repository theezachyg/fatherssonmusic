# Email Service Setup for Contact Form

The contact form is now functional but needs email configuration to actually send messages. Here's how to set it up:

## Option 1: Resend (Recommended - Free Tier Available)

Resend is a modern email API with a generous free tier (100 emails/day, 3,000/month).

### Steps:

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up for a free account
   - Verify your email

2. **Get API Key**
   - In Resend dashboard, go to **API Keys**
   - Click **Create API Key**
   - Name it "Fathers Son Music Contact Form"
   - Copy the API key (you won't see it again!)

3. **Verify Your Domain** (Optional but recommended)
   - Go to **Domains** in Resend dashboard
   - Add `fatherssonmusic.com` (or your custom domain)
   - Add the provided DNS records to your domain
   - OR use Resend's free domain: `onboarding@resend.dev`

4. **Add Environment Variables to Cloudflare Pages**
   - Go to https://dash.cloudflare.com
   - Navigate to **Pages** → **fatherssonmusic**
   - Go to **Settings** → **Environment variables**
   - Add these variables:
     - **RESEND_API_KEY**: `your_api_key_here`
     - **CONTACT_EMAIL**: `your-email@instinctive.xyz` (where you want to receive messages)
   - Click **Save**

5. **Redeploy** (if needed)
   ```bash
   wrangler pages deploy . --project-name=fatherssonmusic --branch=main
   ```

## Option 2: Use Cloudflare Email Routing (Free)

If you have a custom domain with Cloudflare DNS:

1. Go to Cloudflare Dashboard → **Email** → **Email Routing**
2. Enable Email Routing for your domain
3. Set up forwarding rules to your personal email
4. Modify `/functions/contact.js` to use Cloudflare's email sending

## Option 3: Use FormSubmit (Simplest - No Code Changes)

If you want the easiest solution:

1. Go to https://formsubmit.co
2. Follow their instructions (very simple)
3. Update the form action in `index.html` to point to FormSubmit
4. No environment variables needed!

## Testing the Contact Form

After setup:

1. Visit https://fatherssonmusic.pages.dev
2. Scroll to the **Contact** section
3. Fill out and submit the form
4. Check your configured email inbox
5. Check Cloudflare Pages logs for any errors:
   - Dashboard → Pages → fatherssonmusic → **Functions** tab

## Current Status

✅ Contact form UI complete
✅ Serverless function deployed
⏳ Email service configuration needed (choose one option above)

## Need Help?

- Resend Docs: https://resend.com/docs
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/
- FormSubmit: https://formsubmit.co

---

**Recommended**: Use Resend (Option 1) - it's free, reliable, and professional.
