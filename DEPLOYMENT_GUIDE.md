# Deployment Guide

## Current Setup ✅

Your website is already deployed and live at:
- **Production URL**: https://fatherssonmusic.pages.dev
- **GitHub Repository**: https://github.com/theezachyg/fatherssonmusic

## Automatic Deployments from GitHub

Currently, you need to manually deploy using Wrangler. To enable **automatic deployments** when you push to GitHub:

### Steps to Connect GitHub to Cloudflare Pages:

1. **Go to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com
   - Click on **Pages** in the left sidebar
   - Click on **fatherssonmusic** project

2. **Connect to Git**
   - Click **Settings** tab
   - Scroll to **Builds & deployments**
   - Click **Connect to Git provider**
   - Select **GitHub**

3. **Authorize Cloudflare**
   - Click **Connect GitHub**
   - Authorize Cloudflare to access your GitHub account
   - Select **theezachyg/fatherssonmusic** repository

4. **Configure Build Settings**
   - **Production branch**: `main`
   - **Build command**: (leave empty - it's a static site)
   - **Build output directory**: `/` (root)
   - Click **Save**

5. **Test Automatic Deployment**
   - Make any small change to your website
   - Commit and push to GitHub:
     ```bash
     git add .
     git commit -m "Test automatic deployment"
     git push
     ```
   - Watch the deployment happen automatically in Cloudflare dashboard!

## Manual Deployment (Current Method)

If you prefer manual control or automatic deployments aren't set up yet:

```bash
# Navigate to project directory
cd "/Users/zachariahgreen/Dev Envrioment/fatherssonmusic"

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=fatherssonmusic --branch=main
```

## Custom Domain Setup

Want to use **fatherssonmusic.com** instead of **.pages.dev**?

### Steps:

1. **Add Custom Domain in Cloudflare**
   - Go to Pages → fatherssonmusic → **Custom domains**
   - Click **Set up a custom domain**
   - Enter your domain: `fatherssonmusic.com`
   - Follow the DNS configuration instructions

2. **DNS Configuration** (if domain is with Cloudflare)
   - Cloudflare will automatically configure DNS
   - Enable **Automatic HTTPS**

3. **DNS Configuration** (if domain is elsewhere)
   - Add the CNAME record provided by Cloudflare
   - Point `fatherssonmusic.com` to `fatherssonmusic.pages.dev`

## Environment Variables

To add environment variables (like API keys):

1. Go to Pages → fatherssonmusic → **Settings** → **Environment variables**
2. Click **Add variable**
3. Add your variables:
   - `RESEND_API_KEY` - for email sending
   - `CONTACT_EMAIL` - where to receive contact form messages
4. Click **Save** and redeploy

## Monitoring & Logs

- **Function Logs**: Pages → fatherssonmusic → **Functions** tab
- **Deployment History**: Pages → fatherssonmusic → **Deployments** tab
- **Analytics**: Pages → fatherssonmusic → **Analytics** tab

## Rollback to Previous Version

If something goes wrong:

1. Go to **Deployments** tab
2. Find the working deployment
3. Click **···** (three dots)
4. Select **Rollback to this deployment**

## Git Workflow

Recommended workflow for updates:

```bash
# 1. Make changes to your files
# 2. Stage changes
git add .

# 3. Commit with descriptive message
git commit -m "Update homepage content"

# 4. Push to GitHub (triggers auto-deploy if configured)
git push

# 5. Check deployment status in Cloudflare dashboard
```

## Troubleshooting

### Deploy fails with "Authentication required"
```bash
wrangler login
```

### Git push fails
- Make sure you're using SSH: `git@github.com:theezachyg/fatherssonmusic.git`
- Or set up GitHub credentials for HTTPS

### Changes not showing up
- Clear browser cache (Cmd+Shift+R on Mac)
- Wait 1-2 minutes for CDN propagation
- Check deployment status in Cloudflare dashboard

## Production Checklist

Before going live with custom domain:

- [ ] Set up email service (see EMAIL_SETUP.md)
- [ ] Test contact form thoroughly
- [ ] Add Google Analytics (if desired)
- [ ] Test on mobile devices
- [ ] Test all song download links
- [ ] Verify all modal windows work
- [ ] Check privacy policy and terms
- [ ] Enable automatic GitHub deployments
- [ ] Set up custom domain
- [ ] Test site speed (https://pagespeed.web.dev)

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [GitHub Repository](https://github.com/theezachyg/fatherssonmusic)

---

**Need help?** Check the Cloudflare dashboard or documentation linked above.
