# Google Tag Manager Setup Guide
## Fathers Son Music Website Analytics

This guide will walk you through configuring Google Tag Manager to track all user interactions on the Fathers Son Music website.

---

## Overview

**Container ID:** GTM-WWC8RG79
**GA4 Measurement ID:** G-QK8DE4JSF0

### Data Layer Events Implemented:

1. **page_view** - Page views
2. **song_play** - When a user plays a song
3. **begin_checkout** - When user starts donation or download checkout
4. **free_download** - When user downloads a song for free
5. **newsletter_signup** - Newsletter subscriptions
6. **contact_form_submit** - Contact form submissions

---

## Step 1: Configure GA4 Configuration Tag

1. Go to https://tagmanager.google.com
2. Open your container: **GTM-WWC8RG79**
3. Click **Tags** → **New**
4. Name: `GA4 Configuration`
5. Click **Tag Configuration**
6. Choose **Google Analytics: GA4 Configuration**
7. **Measurement ID:** `G-QK8DE4JSF0`
8. Click **Triggering**
9. Select **All Pages**
10. Click **Save**

---

## Step 2: Configure GA4 Event Tag

1. Click **Tags** → **New**
2. Name: `GA4 - All Events`
3. Click **Tag Configuration**
4. Choose **Google Analytics: GA4 Event**
5. **Configuration Tag:** Select `GA4 Configuration`
6. **Event Name:** `{{Event}}` (this is a variable we'll create)
7. Click **Triggering**
8. Click the **+** icon to create a new trigger
9. Name: `Custom Events`
10. **Trigger Type:** Custom Event
11. **Event name:** `.*` (regex - matches all events)
12. **Use regex matching:** ✓ Check this box
13. Click **Save**
14. Click **Save** on the tag

---

## Step 3: Create Event Name Variable

1. Click **Variables** in the left sidebar
2. Under **User-Defined Variables**, click **New**
3. Name: `Event`
4. Click **Variable Configuration**
5. Choose **Data Layer Variable**
6. **Data Layer Variable Name:** `event`
7. Click **Save**

---

## Step 4: Configure E-commerce Tracking

### 4a. Create E-commerce Variables

1. Click **Variables** → **New**
2. Name: `Ecommerce Value`
3. **Variable Type:** Data Layer Variable
4. **Data Layer Variable Name:** `value`
5. Click **Save**

Repeat for these variables:
- Name: `Ecommerce Currency` → Variable: `currency`
- Name: `Ecommerce Items` → Variable: `items`
- Name: `Transaction Type` → Variable: `transaction_type`

### 4b. Create E-commerce Event Parameters

1. Edit the `GA4 - All Events` tag
2. Under **Event Parameters**, click **Add Row**
3. Add these parameters:

| Parameter Name | Value |
|----------------|-------|
| currency | {{Ecommerce Currency}} |
| value | {{Ecommerce Value}} |
| items | {{Ecommerce Items}} |
| transaction_type | {{Transaction Type}} |

4. Click **Save**

---

## Step 5: Create Song Tracking Variables

1. Click **Variables** → **New**
2. Name: `Song Title`
3. **Variable Type:** Data Layer Variable
4. **Data Layer Variable Name:** `song_title`
5. Click **Save**

Repeat for:
- Name: `Song Description` → Variable: `song_description`
- Name: `Download Type` → Variable: `download_type`
- Name: `Engagement Type` → Variable: `engagement_type`

---

## Step 6: Add Event Parameters for Song Tracking

1. Edit the `GA4 - All Events` tag
2. Add these additional event parameters:

| Parameter Name | Value |
|----------------|-------|
| song_title | {{Song Title}} |
| song_description | {{Song Description}} |
| download_type | {{Download Type}} |
| engagement_type | {{Engagement Type}} |
| form_name | {{Form Name}} |
| method | {{Method}} |

3. Create the missing variables (**Form Name** and **Method**) as Data Layer Variables
4. Click **Save**

---

## Step 7: Set Up Conversion Events in GA4

1. Go to https://analytics.google.com
2. Select your property: **Fathers Son Music Website**
3. Click **Configure** → **Events**
4. Click **Create event**
5. Create these conversion events:

### Conversion Events to Mark:

- `begin_checkout` - Donation/Download started
- `free_download` - Free download completed
- `newsletter_signup` - Newsletter subscription
- `contact_form_submit` - Contact form submitted
- `song_play` - Song played (engagement metric)

For each event:
1. Find the event in the list (it will appear after data starts flowing)
2. Toggle **Mark as conversion**

---

## Step 8: Test Your Setup

1. In GTM, click **Preview**
2. Enter your website URL: `https://fatherssonmusic.com`
3. Test these actions:
   - ✓ Play a song
   - ✓ Click download and select free download
   - ✓ Submit contact form
   - ✓ Subscribe to newsletter
   - ✓ Start a donation
4. Verify events appear in the GTM preview debugger
5. Check events in GA4 Real-Time report

---

## Step 9: Publish Your Container

1. Click **Submit** in GTM (top right)
2. Add **Version Name:** `Initial GA4 Setup`
3. Add **Version Description:** `Configured GA4 tracking for all major events`
4. Click **Publish**

---

## Events Summary

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| page_view | Page load | page_title, page_location, page_path |
| song_play | User plays song | song_title, song_description, engagement_type |
| begin_checkout | Checkout started | currency, value, items, transaction_type |
| free_download | Free download | song_title, download_type, value |
| newsletter_signup | Newsletter form submit | method, form_name |
| contact_form_submit | Contact form submit | method, form_name |

---

## Advanced: Custom Dimensions (Optional)

To create custom dimensions for better segmentation:

1. In GA4, go to **Configure** → **Custom definitions**
2. Click **Create custom dimension**
3. Create these:

| Dimension Name | Event Parameter | Scope |
|----------------|-----------------|-------|
| Song Title | song_title | Event |
| Transaction Type | transaction_type | Event |
| Download Type | download_type | Event |
| Form Name | form_name | Event |

---

## Monitoring & Optimization

### Daily Checks:
- Monitor GA4 Real-Time report for active users
- Check Events report for event counts
- Review Conversions for goal completions

### Weekly Reviews:
- Analyze which songs are most played
- Track donation vs. free download ratios
- Monitor form submission rates

### Monthly Optimization:
- Review user paths to conversions
- Identify drop-off points
- Optimize high-traffic, low-conversion pages

---

## Troubleshooting

**Events not showing in GA4?**
- Check GTM Preview mode - are events firing?
- Verify GA4 Measurement ID is correct
- Wait 24-48 hours for data to populate

**Ecommerce data missing?**
- Verify items array is properly formatted
- Check that value and currency are numbers/strings
- Review event parameters in GTM debugger

**Need help?**
- GTM Community: https://support.google.com/tagmanager
- GA4 Documentation: https://support.google.com/analytics

---

✅ **Your analytics setup is complete!**
