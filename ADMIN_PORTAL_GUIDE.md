# Admin Portal Guide
## Fathers Son Music - Submissions Management

---

## 🔐 Access the Admin Portal

**URL**: https://fatherssonmusic.com/admin.html

**Password**: `FSM2024Admin!Secure`

> **Note**: You can change this password by running:
> ```bash
> echo "YourNewPassword" | wrangler pages secret put ADMIN_PASSWORD --project-name=fatherssonmusic
> ```

---

## 📊 Dashboard Features

### Statistics Overview

The dashboard displays real-time statistics:
- **Total Submissions** - All form submissions
- **Contact Forms** - Messages from the contact form
- **Newsletter Signups** - Email subscriptions
- **Downloads** - Both free and paid song downloads
- **Donations** - Monetary contributions

### Submissions Table

View all submissions with:
- **Date/Time** - When the submission was received
- **Name** - User's first and last name
- **Email** - Contact email address
- **Form Type** - Which form was submitted
- **Details** - Additional information (message content, song title, amount, etc.)
- **Status** - New or Read

---

## 🔍 Filtering & Search

### Search Box
Search by name or email address in real-time.

### Form Type Filter
Filter submissions by type:
- All Forms
- Contact Forms
- Newsletter Signups
- Free Downloads
- Paid Downloads
- Donations

### Status Filter
Filter by status:
- All Status
- New - Unread submissions
- Read - Reviewed submissions

---

## ✅ Managing Submissions

### Mark as Read/New
Click the **Mark Read** or **Mark New** button next to any submission to update its status.

This helps you keep track of which submissions you've reviewed.

---

## 📥 Export to CSV

Click the **Export CSV** button to download all submissions as a CSV file.

**File format**:
- Date, First Name, Last Name, Email, Form Type, Details, Status
- Filename: `submissions-YYYY-MM-DD.csv`

You can open this in Excel, Google Sheets, or any spreadsheet application.

---

## 📋 Submission Types Tracked

| Form Type | Description | Details Included |
|-----------|-------------|------------------|
| **Contact Form** | Website contact messages | Message content (first 500 chars) |
| **Newsletter Signup** | Email list subscriptions | "Subscribed to newsletter" |
| **Song Download - Free** | Free song downloads | Song title |
| **Song Download - Paid** | Paid song downloads | Song title + Amount paid |
| **Donation** | Monetary donations | Amount donated |

---

## 🔒 Security Features

### Password Protected
The admin portal requires password authentication to access.

### Session Management
Your login session is stored locally and will expire when you close the browser or click **Logout**.

### Authorization Check
All API requests are authenticated with a bearer token to prevent unauthorized access.

---

## 💾 Database Information

**Database**: Cloudflare D1 (SQL)
**Location**: WNAM region
**Table**: `submissions`

### Database Schema
```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    form_type TEXT NOT NULL,
    additional_info TEXT,
    status TEXT DEFAULT 'new'
);
```

---

## 🚀 How It Works

1. **User submits a form** on fatherssonmusic.com
2. **Data is saved** to Cloudflare D1 database
3. **Email is sent** (if Resend is configured)
4. **Submission appears** in admin portal instantly
5. **You review** and mark as read
6. **Export** data whenever needed

---

## 📱 Mobile Responsive

The admin portal is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

---

## ⚡ Performance

- **Real-time updates** - No page refresh needed
- **Fast search** - Client-side filtering for instant results
- **Efficient database** - Indexed for quick queries
- **Serverless** - No server maintenance required

---

## 🆘 Troubleshooting

### Can't login?
- Verify you're using the correct password
- Check that the ADMIN_PASSWORD environment variable is set

### Submissions not appearing?
- Check that forms are submitting successfully
- Verify D1 database binding is configured in wrangler.toml
- Check Cloudflare Pages logs for errors

### Export not working?
- Ensure you have submissions to export
- Check browser console for errors
- Try a different browser

---

## 📞 Support

For technical issues or questions:
- Check Cloudflare Pages dashboard for deployment logs
- Review the database directly: `wrangler d1 execute fatherssonmusic-submissions --command="SELECT * FROM submissions LIMIT 10" --remote`

---

✅ **Your admin portal is ready to use!**

Access it at: https://fatherssonmusic.com/admin.html
