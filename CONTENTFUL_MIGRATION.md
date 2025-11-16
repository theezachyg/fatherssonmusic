# Migrating Songs to Contentful

## Upload Your Assets First

Before creating song entries, upload all media assets:

### Go to Media:
1. Click **Media** in the left sidebar
2. Click **Add assets** → **Upload**
3. Upload these files:

**Background Images (song cards):**
- `1-Message_in_the_Song-Fathers_Son_Music.jpg`
- `2-Grandpa_Joe-Fathers_Son_Music.jpg`
- `3-Spiritual_Abuse-Fathers_Son_Music.jpg`

**Audio Files:**
- `1-Message_in_the_Song-Fathers_Son_Music.mp3`
- `2-Grandpa_Joe-Fathers_Son_Music.mp3`
- `3-Spiritual_Abuse-Fathers_Son_Music.mp3`

---

## Create Song Entry #1: Message In The Song

**Content** → **Add entry** → **Song**

### Fields:

**Song Title:** `Message In The Song`

**Slug ID:** `message-in-the-song`

**Display Order:** `1`

**Publish Status:** ✅ `true`

**Coming Soon flag:** ☐ `false`

**Release Date:** `2025-10-15`

**Song Description:**
```
A powerful reminder that it's not about the music—it's about the message. This song encourages believers to test everything against Scripture and focus on Christ, not organizations.
```

**Short Description:**
```
A song about discerning truth through God's Word
```

**Duration:** `4:23`

**Lyrics:**
(Copy from your existing lyrics in the website - format with **bold** for chorus)

**Background Artwork:**
- Click **Add existing media**
- Select `1-Message_in_the_Song-Fathers_Son_Music.jpg`

**Album Artwork:** (optional - leave blank for now)

**Streaming Audio File:**
- Click **Add existing media**
- Select `1-Message_in_the_Song-Fathers_Son_Music.mp3`

**Download Audio File:**
- Click **Add existing media**
- Select `1-Message_in_the_Song-Fathers_Son_Music.mp3` (same file)

**Streaming toggle:** ✅ `true`

**Downloads toggle:** ✅ `true`

**Lyrics toggle:** ✅ `true`

**Meta Title:** `Message In The Song - Fathers Son Music`

**Meta Description:**
```
A powerful Christian song about testing everything against Scripture and focusing on Christ, not organizations.
```

**Share Image:** (leave blank)

Click **Publish** (top right)

---

## Create Song Entry #2: Grandpa Nick

**Content** → **Add entry** → **Song**

### Fields:

**Song Title:** `Grandpa Nick`

**Slug ID:** `grandpa-nick`

**Display Order:** `2`

**Publish Status:** ✅ `true`

**Coming Soon flag:** ☐ `false`

**Release Date:** `2025-11-01`

**Song Description:**
```
A heartfelt story about church splits and family division. This song explores the pain of separation and the hope of reunion through Christ, not through man-made divisions.
```

**Short Description:**
```
A story of church splits and family healing
```

**Duration:** `3:52`

**Lyrics:**
(Copy from your existing lyrics)

**Background Artwork:**
- Select `2-Grandpa_Joe-Fathers_Son_Music.jpg`

**Streaming Audio File:**
- Select `2-Grandpa_Joe-Fathers_Son_Music.mp3`

**Download Audio File:**
- Select `2-Grandpa_Joe-Fathers_Son_Music.mp3`

**Streaming toggle:** ✅ `true`

**Downloads toggle:** ✅ `true`

**Lyrics toggle:** ✅ `true`

**Meta Title:** `Grandpa Nick - Fathers Son Music`

**Meta Description:**
```
A heartfelt Christian song about church splits, family division, and finding reunion through Christ.
```

Click **Publish**

---

## Create Song Entry #3: Spiritual Abuse

**Content** → **Add entry** → **Song**

### Fields:

**Song Title:** `Spiritual Abuse`

**Slug ID:** `spiritual-abuse`

**Display Order:** `3`

**Publish Status:** ✅ `true`

**Coming Soon flag:** ☐ `false`

**Release Date:** `2025-11-01`

**Song Description:**
```
An honest, raw look at spiritual manipulation and control. This song speaks to those who've experienced abuse in religious settings and points them to freedom in Christ.
```

**Short Description:**
```
Finding freedom from spiritual manipulation
```

**Duration:** `4:15`

**Lyrics:**
(Copy from your existing lyrics)

**Background Artwork:**
- Select `3-Spiritual_Abuse-Fathers_Son_Music.jpg`

**Streaming Audio File:**
- Select `3-Spiritual_Abuse-Fathers_Son_Music.mp3`

**Download Audio File:**
- Select `3-Spiritual_Abuse-Fathers_Son_Music.mp3`

**Streaming toggle:** ✅ `true`

**Downloads toggle:** ✅ `true`

**Lyrics toggle:** ✅ `true`

**Meta Title:** `Spiritual Abuse - Fathers Son Music`

**Meta Description:**
```
An honest Christian song about spiritual manipulation and finding freedom in Christ from religious control.
```

Click **Publish**

---

## Test Your Setup

1. Refresh your website
2. Songs should load automatically from Contentful
3. Test:
   - Streaming buttons
   - Lyrics display
   - Download modals
   - Coming soon cards (try toggling one song to "Coming Soon")

---

## Adding Future Songs

To add a new song:
1. Upload media to Contentful
2. Create new Song entry
3. Set **Display Order** (4, 5, 6, etc.)
4. Fill in all fields
5. Toggle **Streaming/Downloads/Lyrics** as needed
6. **Publish** when ready
7. Or set **Coming Soon flag** to `true` to tease it

The website will automatically fetch and display it!

---

## Managing Songs

### Hide a song temporarily:
- Set **Publish Status** to `false`
- Click **Publish**

### Reorder songs:
- Change **Display Order** numbers
- Click **Publish**

### Tease upcoming song:
- Set **Coming Soon flag** to `true`
- Fill in title, description, release date
- Upload background artwork
- Leave audio files empty (optional)
- Set **Publish Status** to `true`
- Song card will show "Coming Soon" message

---

🎉 Your website is now powered by Contentful CMS!
