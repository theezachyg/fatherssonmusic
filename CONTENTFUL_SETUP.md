# Contentful CMS Setup Guide

## Content Model: Song

### Field Configuration

Create a new Content Type called **"Song"** with the following fields:

---

### 1. **Song Title** (required)
- **Field ID**: `songTitle`
- **Type**: Short text
- **Validation**: Required, Unique
- **Help text**: The full title of the song

---

### 2. **Slug** (required)
- **Field ID**: `slug`
- **Type**: Short text
- **Validation**: Required, Unique, Match pattern: `^[a-z0-9-]+$`
- **Help text**: URL-friendly identifier (e.g., "message-in-the-song")
- **Appearance**: Slug

---

### 3. **Display Order** (required)
- **Field ID**: `displayOrder`
- **Type**: Integer
- **Validation**: Required, Unique
- **Help text**: Controls the order songs appear (1 = first, 2 = second, etc.)
- **Default**: 999

---

### 4. **Publish Status** (required)
- **Field ID**: `publishStatus`
- **Type**: Boolean
- **Validation**: Required
- **Help text**: Toggle to publish/unpublish the song
- **Default**: false

---

### 5. **Coming Soon** (required)
- **Field ID**: `comingSoon`
- **Type**: Boolean
- **Validation**: Required
- **Help text**: Show as "Coming Soon" instead of playable
- **Default**: false

---

### 6. **Release Date** (required)
- **Field ID**: `releaseDate`
- **Type**: Date and time
- **Validation**: Required
- **Help text**: When the song was/will be released

---

### 7. **Song Description** (required)
- **Field ID**: `songDescription`
- **Type**: Long text
- **Validation**: Required
- **Help text**: Full description for the song card (2-3 sentences)

---

### 8. **Short Description** (required)
- **Field ID**: `shortDescription`
- **Type**: Short text
- **Validation**: Required, Max 100 characters
- **Help text**: Brief description shown in the audio player

---

### 9. **Duration** (required)
- **Field ID**: `duration`
- **Type**: Short text
- **Validation**: Required, Match pattern: `^[0-9]{1,2}:[0-5][0-9]$`
- **Help text**: Song duration in MM:SS format (e.g., "3:45")

---

### 10. **Lyrics** (optional)
- **Field ID**: `lyrics`
- **Type**: Long text (Markdown)
- **Validation**: Optional
- **Help text**: Full song lyrics in Markdown format. Use **bold** for chorus lines.

---

### 11. **Background Artwork** (required)
- **Field ID**: `backgroundArtwork`
- **Type**: Media (single file)
- **Validation**: Required, File type: Images
- **Help text**: Background image for the song card (recommended: 1200x1200px, JPG optimized)

---

### 12. **Album Artwork** (optional)
- **Field ID**: `albumArtwork`
- **Type**: Media (single file)
- **Validation**: Optional, File type: Images
- **Help text**: Square album artwork (recommended: 800x800px)

---

### 13. **Streaming Audio File** (optional)
- **Field ID**: `streamingFile`
- **Type**: Media (single file)
- **Validation**: Optional, File type: Audio
- **Help text**: MP3 file for streaming playback

---

### 14. **Download Audio File** (optional)
- **Field ID**: `downloadFile`
- **Type**: Media (single file)
- **Validation**: Optional, File type: Audio
- **Help text**: High-quality MP3 for downloads (can be same as streaming)

---

### 15. **Availability Settings**
- **Field ID**: `availability`
- **Type**: JSON Object
- **Validation**: Optional
- **Help text**: Control what features are available
- **Example**:
```json
{
  "streaming": true,
  "downloads": true,
  "lyrics": true
}
```

---

### 16. **SEO Meta Title** (optional)
- **Field ID**: `seoMetaTitle`
- **Type**: Short text
- **Validation**: Optional, Max 60 characters
- **Help text**: SEO title for the song page (if used)

---

### 17. **SEO Meta Description** (optional)
- **Field ID**: `seoMetaDescription`
- **Type**: Long text
- **Validation**: Optional, Max 160 characters
- **Help text**: SEO description for search engines

---

### 18. **SEO Share Image** (optional)
- **Field ID**: `seoShareImage`
- **Type**: Media (single file)
- **Validation**: Optional, File type: Images
- **Help text**: Image for social media sharing (recommended: 1200x630px)

---

## Content Model Preview

**Display field**: `songTitle`
**Entry title**: `{songTitle}`

---

## Example Entry

```
Song Title: Message In The Song
Slug: message-in-the-song
Display Order: 1
Publish Status: ✓ Published
Coming Soon: ☐ No
Release Date: October 15, 2025
Song Description: A powerful reminder that it's not about the music—it's about the message...
Short Description: A song about discerning truth through God's Word
Duration: 4:23
Lyrics: [Markdown content with **bold chorus**]
Background Artwork: [1-Message_in_the_Song.jpg]
Album Artwork: [album-cover.jpg]
Streaming File: [1-Message_in_the_Song.mp3]
Download File: [1-Message_in_the_Song-HQ.mp3]
Availability: {"streaming": true, "downloads": true, "lyrics": true}
SEO Meta Title: Message In The Song - Fathers Son Music
SEO Meta Description: A powerful Christian song about testing everything against Scripture...
SEO Share Image: [social-share.jpg]
```

---

## Next Steps

1. Create this content model in Contentful
2. Create 3 song entries (migrate existing songs)
3. Get your Contentful Space ID and Access Token
4. Integrate with the website

---

## API Integration

You'll need:
- **Space ID**: Found in Settings → General Settings
- **Content Delivery API Token**: Found in Settings → API keys → Create new key

Save these for the integration step!
