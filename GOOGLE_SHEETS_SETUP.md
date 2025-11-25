# Google Sheets Integration Setup Guide
## Track All Form Submissions to Google Sheets

This guide will help you set up automatic logging of all form submissions to a Google Sheet.

---

## Step 1: Create Your Google Sheet

1. Go to https://sheets.google.com
2. Click **+ Blank** to create a new spreadsheet
3. Name it: `Fathers Son Music - Form Submissions`
4. In Row 1, add these column headers:
   - **A1**: Date/Time
   - **B1**: First Name
   - **C1**: Last Name
   - **D1**: Email
   - **E1**: Form Name
   - **F1**: Additional Info

---

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Get current timestamp
    var timestamp = new Date();

    // Prepare row data
    var rowData = [
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.formName || '',
      data.additionalInfo || ''
    ];

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)
5. Name the project: `Form Submissions Logger`

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: `Form submissions tracker`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
5. Click **Deploy**
6. **IMPORTANT**: Copy the **Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. Click **Done**

---

## Step 4: Add Web App URL to Cloudflare

You'll need to add this URL as an environment variable in your Cloudflare Pages project.

### Option A: Using Wrangler CLI

Run this command (replace `YOUR_WEB_APP_URL` with the URL you copied):

```bash
wrangler pages secret put GOOGLE_SHEETS_WEBHOOK_URL
# Paste your URL when prompted
```

### Option B: Using Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Select your account: **ZLG-Cloudflare Account**
3. Click **Workers & Pages**
4. Click on **fatherssonmusic**
5. Go to **Settings** tab
6. Scroll to **Environment variables**
7. Click **Add variable**
8. **Variable name**: `GOOGLE_SHEETS_WEBHOOK_URL`
9. **Value**: Paste your Web App URL
10. Click **Save**

---

## Step 5: Test the Integration

After deploying the updated code, test each form:

1. **Contact Form** - Submit a contact message
2. **Newsletter** - Subscribe to the newsletter
3. **Download** - Download a song (free or paid)
4. **Donation** - Make a test donation

Check your Google Sheet - you should see a new row for each submission!

---

## Data Collected by Form

| Form Name | Additional Info |
|-----------|----------------|
| Contact Form | Message preview (first 100 chars) |
| Newsletter Signup | "Subscribed to newsletter" |
| Song Download - Free | Song title |
| Song Download - Paid | Song title + Amount |
| Donation | Amount donated |

---

## Formatting Your Sheet (Optional)

### Make it look professional:

1. **Freeze the header row**:
   - Click on row 1
   - View → Freeze → 1 row

2. **Format Date/Time column**:
   - Select column A
   - Format → Number → Date time

3. **Add color to header**:
   - Select row 1
   - Fill color: Light blue
   - Text: Bold

4. **Auto-resize columns**:
   - Select all columns
   - Right-click → Resize columns → Fit to data

5. **Add alternating colors**:
   - Select all data
   - Format → Alternating colors

---

## Privacy & Security Notes

⚠️ **Important**:
- This sheet will contain personal information (emails, names)
- Only share with trusted team members
- Consider GDPR/privacy compliance for your region
- The Apps Script runs as "Anyone" can access, but the URL is secret
- Keep your Web App URL confidential

---

## Troubleshooting

**Submissions not appearing?**
1. Check the Apps Script execution log: Extensions → Apps Script → Executions
2. Verify the environment variable is set in Cloudflare
3. Check browser console for errors
4. Verify the Web App is deployed (not just saved)

**Permission errors?**
- Re-deploy the Web App and make sure "Execute as: Me" is selected
- Grant necessary permissions when prompted

**Need help?**
- Check the Apps Script logs for detailed error messages
- Ensure the sheet has the correct column headers
- Verify the Web App URL is correct in Cloudflare

---

✅ **Setup complete!** All form submissions will now be automatically logged to your Google Sheet.
