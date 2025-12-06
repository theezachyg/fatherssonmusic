# Bulk Download Feature Setup Guide

## Overview

The bulk download feature allows website visitors to download all available songs with a single form submission. Instead of filling out the form for each song individually, users can now:


1. Click "Download All Songs" button
2. Enter their information once
3. Receive an email with links to all available songs

## What Was Added

### 1. Backend API Endpoint
**File**: `/functions/api/send-bulk-download-links.js`
- Fetches all published songs from Contentful
- Filters songs that have downloads enabled
- Sends a single email with all download links
- Logs the submission to the database

### 2. Frontend Components
**Updates to**: `index.html`
- Added "Download All Songs" button in the songs section
- Created bulk download modal
- Added JavaScript functions to handle the feature

## Required Environment Variables

Add these environment variables in **Cloudflare Pages → Settings → Environment variables**:

| Variable Name | Description | Where to Find |
|--------------|-------------|---------------|
| `CONTENTFUL_SPACE_ID` | Your Contentful space ID | Already in `index.html` line 2422: `308hvpg1ay69` |
| `CONTENTFUL_ACCESS_TOKEN` | Content Delivery API token | Already in `index.html` line 2423: `YGoIFZDwKK0htY5meHolEWTCwIhYH0Z3xTNy0lwpYXw` |
| `RESEND_API_KEY` | Already configured | Existing setup |

### Adding Environment Variables

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Select your project: **fatherssonmusic**
3. Go to **Settings** → **Environment variables**
4. Click **Add variable**
5. Add both:
   - Variable name: `CONTENTFUL_SPACE_ID`
   - Value: `308hvpg1ay69`
   - Environment: Production (and Preview if testing)
6. Click **Add variable** again
7. Add:
   - Variable name: `CONTENTFUL_ACCESS_TOKEN`
   - Value: `YGoIFZDwKK0htY5meHolEWTCwIhYH0Z3xTNy0lwpYXw`
   - Environment: Production (and Preview if testing)
8. **Redeploy** your site for the changes to take effect

## How It Works

### User Flow
1. User visits the songs section
2. Clicks "Download All Songs" button
3. Modal opens asking for:
   - First Name
   - Last Name
   - Email Address
4. User clicks "Send Download Links"
5. Receives email with all available songs

### Backend Flow
1. API receives user information
2. Fetches all songs from Contentful
3. Filters for published songs with `downloadsToggle: true` and `downloadAudioFile` present
4. Generates email with formatted download links
5. Sends email via Resend
6. Logs submission to D1 database

### Email Format
The email includes:
- Personalized greeting
- Total song count
- Individual song cards with:
  - Song title
  - Description (if available)
  - Download button
- Footer with links to website

## Testing

### Local Testing
The feature requires Cloudflare Pages Functions, so local testing needs:
```bash
npm install -g wrangler
wrangler pages dev . --binding DB=<your-db-id>
```

### Production Testing
1. Deploy to Cloudflare Pages
2. Ensure environment variables are set
3. Visit https://fatherssonmusic.com
4. Scroll to "Our Songs" section
5. Click "Download All Songs"
6. Fill in test information
7. Check email for download links

## Database Logging

Bulk downloads are logged in the submissions table with:
- `form_type`: "Bulk Song Download - Free"
- `additional_info`: List of all song titles sent

View submissions in the admin portal: https://fatherssonmusic.com/admin.html

## Analytics Tracking

The feature tracks Google Analytics events:
- Event name: `bulk_download`
- Parameters:
  - `download_type`: "bulk_free"
  - `song_count`: Number of songs sent
  - `value`: 0
  - `currency`: "USD"

## Troubleshooting

### "Content service not configured" error
**Cause**: Missing Contentful environment variables
**Fix**: Add `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` to Cloudflare Pages settings

### "Email service not configured" error
**Cause**: Missing Resend API key
**Fix**: Verify `RESEND_API_KEY` is set in environment variables

### "No songs available for download" error
**Cause**: No songs have both `downloadsToggle: true` and `downloadAudioFile` set
**Fix**: Check Contentful song entries and ensure downloads are properly configured

### Email not received
**Causes**:
- Email in spam folder
- Resend domain not verified
- Invalid email address

**Fixes**:
- Check spam/junk folder
- Verify domain in Resend dashboard
- Test with different email address

## Future Enhancements

Possible improvements:
1. **ZIP file generation**: Create a single ZIP file with all songs
2. **Selective downloads**: Allow users to choose which songs to download
3. **Download limits**: Add rate limiting to prevent abuse
4. **Progress tracking**: Show download progress for each song
5. **Paid bulk downloads**: Add option to support ministry with bulk downloads

## Security Notes

- The Contentful Content Delivery API token is read-only and safe to expose in frontend
- Email addresses are validated before processing
- Database logging helps track and prevent abuse
- No sensitive data is stored in the frontend

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify environment variables in Cloudflare Pages
3. Check Resend dashboard for email delivery status
4. Review submissions in admin portal
5. Check Cloudflare Pages deployment logs

---

✅ **The bulk download feature is now ready! Just add the environment variables and deploy.**
