# Contentful Download Setup Guide
## Enable Song Downloads for Fathers Son Music

---

## 🎵 Issue: "Error sending download link"

This error occurs because the **Download Audio File** field in Contentful is not set up or populated.

---

## ✅ Required Contentful Fields

Your "Song" content type needs these fields for downloads to work:

| Field Name | Field ID | Type | Required |
|------------|----------|------|----------|
| Song Title | `songTitle` | Short Text | ✅ Yes |
| Downloads Toggle | `downloadsToggle` | Boolean | ✅ Yes |
| Download Audio File | `downloadAudioFile` | Media (File) | ✅ Yes |
| Streaming Audio File | `streamingAudioFile` | Media (File) | For streaming |
| Streaming Toggle | `streamingToggle` | Boolean | For streaming |
| Lyrics Toggle | `lyricsToggle` | Boolean | For lyrics |
| Lyrics | `lyrics` | Rich Text | For lyrics |

---

## 🚀 Setup Steps

### Step 1: Add Download Audio File Field (if missing)

1. Log in to Contentful: https://app.contentful.com
2. Go to **Content model** in the top nav
3. Click on your **Song** content type
4. Check if **Download Audio File** field exists
5. If it doesn't exist:
   - Click **Add field** button
   - Select **Media** → **One file**
   - Name: `Download Audio File`
   - Field ID: `downloadAudioFile`
   - Click **Create**
   - Click **Save** on the content model

### Step 2: Add Downloads Toggle Field (if missing)

1. Still in the Song content model
2. Check if **Downloads Toggle** field exists
3. If it doesn't exist:
   - Click **Add field**
   - Select **Boolean**
   - Name: `Downloads Toggle`
   - Field ID: `downloadsToggle`
   - Click **Create**
   - Click **Save**

### Step 3: Upload MP3 Files for Each Song

1. Go to **Content** in the top nav
2. Click on a song entry (e.g., "Message in the Song")
3. Scroll to the **Downloads Toggle** field
   - Turn it **ON** (toggle to true)
4. Scroll to the **Download Audio File** field
   - Click **Add media**
   - Either:
     - **Upload** a new MP3 file
     - Or **Link existing asset** if you already uploaded it
5. Select the MP3 file
6. Click **Publish** (top right)
7. Repeat for all songs

---

## 📁 MP3 File Requirements

**Format**: MP3
**Quality**: 320kbps recommended (high quality)
**File Size**: Typically 5-15 MB per song
**Naming**: Use clear names like `Message-in-the-Song.mp3`

---

## 🎛️ Enable Downloads for Each Song

For each song in Contentful:

1. **Open the song** in Content
2. **Enable Downloads Toggle** - Set to ON/True
3. **Add Download Audio File** - Upload or link MP3
4. **Publish** the changes

**Example: "Message in the Song"**
```
Song Title: Message in the Song
Downloads Toggle: ✅ ON
Download Audio File: Message-in-the-Song.mp3 (15.2 MB)
Streaming Toggle: ✅ ON
Streaming Audio File: Message-in-the-Song-streaming.mp3
```

---

## 🔄 How Downloads Work

### When downloads are properly configured:

1. **Download button appears** on song card
2. User clicks **DOWNLOAD**
3. Modal opens with free/paid options
4. User selects amount and enters email
5. If **FREE**:
   - Download link sent via email immediately
   - Link points to Contentful CDN
6. If **PAID**:
   - Redirects to Stripe checkout
   - After payment, webhook sends download link

### The code checks:

```javascript
// Download button only shows if BOTH are true:
if (fields.downloadsToggle && fields.downloadAudioFile) {
    // Show download button
}

// When user clicks download:
const downloadUrl = 'https:' + selectedSongData.fields.downloadAudioFile.fields.file.url;
```

---

## 🧪 Testing After Setup

1. Go to https://fatherssonmusic.com
2. Find a song with downloads enabled
3. Click **DOWNLOAD** button
4. Choose **Free Download**
5. Enter your email
6. Check email for download link
7. Click link to download MP3

---

## 📊 Current Song Configuration

Based on your code, you should configure:

### Message in the Song
- Downloads Toggle: **ON**
- Download Audio File: **Upload MP3**
- Streaming Toggle: **ON**
- Streaming Audio File: **Already configured**

### Grandpa Joe
- Downloads Toggle: **ON**
- Download Audio File: **Upload MP3**
- Streaming Toggle: **ON**
- Streaming Audio File: **Already configured**

### Spiritual Abuse
- Downloads Toggle: **ON**
- Download Audio File: **Upload MP3**
- Streaming Toggle: **ON**
- Streaming Audio File: **Already configured**

---

## 💡 Pro Tips

1. **Use separate files for streaming vs download**:
   - Streaming: Lower bitrate (128kbps) for faster loading
   - Download: Higher bitrate (320kbps) for quality

2. **Or use the same file**:
   - If you want to simplify, upload the same MP3 to both fields
   - Users can stream or download the same quality file

3. **Test with a real email**:
   - Make sure Resend is configured with your domain
   - Test that emails are delivered correctly

4. **Monitor in Admin Portal**:
   - Check https://fatherssonmusic.com/admin.html
   - See download submissions in real-time

---

## ⚠️ Common Issues

### Issue: "Download not available for this song"
**Cause**: Either `downloadsToggle` is OFF or `downloadAudioFile` is missing
**Fix**: Turn on toggle and upload MP3 file

### Issue: Error sending download link
**Cause**: Resend API not configured OR email address invalid
**Fix**:
- Check `RESEND_API_KEY` environment variable
- Verify email address is valid

### Issue: Download button doesn't appear
**Cause**: `downloadsToggle` is OFF
**Fix**: Turn it ON in Contentful and publish

### Issue: Email not received
**Cause**: Resend domain not verified OR spam folder
**Fix**:
- Verify your domain in Resend dashboard
- Check spam/junk folder
- Test with a different email address

---

## 📧 Email Configuration

The download link email is sent by **Resend** and requires:

1. **RESEND_API_KEY** environment variable
2. **Verified domain** in Resend dashboard
3. Current "From" address: `onboarding@resend.dev` (Resend default)

**To use your own domain:**
1. Verify `fatherssonmusic.com` in Resend
2. Update `from:` in `/functions/api/send-download-link.js`
3. Change from `onboarding@resend.dev` to `downloads@fatherssonmusic.com`

---

## 🎯 Quick Checklist

- [ ] Add `downloadAudioFile` field to Song content type (if missing)
- [ ] Add `downloadsToggle` field to Song content type (if missing)
- [ ] Upload MP3 files for each song
- [ ] Enable `downloadsToggle` for each song
- [ ] Publish all changes in Contentful
- [ ] Test download on website
- [ ] Verify email is received
- [ ] Check download link works

---

## 🆘 Need Help?

1. **Contentful Issues**: Check Content model → Song → Fields
2. **Email Issues**: Check Resend dashboard and environment variables
3. **Download Link Issues**: Check browser console for errors
4. **Database Issues**: Check admin portal for submission logs

---

✅ **Once you upload the MP3 files and enable the toggles in Contentful, downloads will work immediately!**
