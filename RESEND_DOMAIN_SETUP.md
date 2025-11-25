# Resend Domain Verification Guide
## Enable Email Sending to Any Address

---

## 🚨 Current Issue

**Error**: "You can only send testing emails to your own email address"

**Cause**: Using Resend's test "from" address (`onboarding@resend.dev`) which can only send to your verified email.

**Solution**: Verify `fatherssonmusic.com` domain in Resend.

---

## ✅ Step-by-Step Setup

### Step 1: Log in to Resend

1. Go to https://resend.com/login
2. Log in with your Resend account

### Step 2: Add Domain

1. Click **Domains** in the left sidebar
2. Click **Add Domain** button
3. Enter: `fatherssonmusic.com`
4. Click **Add**

### Step 3: Verify Domain with DNS Records

Resend will provide you with DNS records to add. You'll need to add these to your Cloudflare DNS:

**Typical records (yours may vary):**

```
Type: TXT
Name: _resend
Value: resend-verify=abc123xyz...
```

```
Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10
```

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**To add these in Cloudflare:**

1. Go to https://dash.cloudflare.com
2. Select `fatherssonmusic.com` domain
3. Click **DNS** → **Records**
4. Click **Add record**
5. Add each record Resend provided
6. Click **Save**

### Step 4: Wait for Verification

1. After adding DNS records, go back to Resend
2. Click **Verify Domain**
3. Wait 5-30 minutes for DNS propagation
4. Resend will show "Verified" when complete

### Step 5: Update "From" Address

Once verified, I'll update the code to use your domain:

**Current:**
```javascript
from: 'Fathers Son Music <onboarding@resend.dev>'
```

**After verification:**
```javascript
from: 'Fathers Son Music <downloads@fatherssonmusic.com>'
```

---

## 📧 Recommended Email Addresses

After verification, you can use any email address at your domain:

- `downloads@fatherssonmusic.com` - For download links
- `contact@fatherssonmusic.com` - For contact form responses
- `info@fatherssonmusic.com` - For general emails
- `noreply@fatherssonmusic.com` - For automated emails

**These don't need to be real mailboxes** - they're just "from" addresses for sending.

---

## 🧪 Testing After Verification

1. Once domain is verified
2. I'll update the code to use your domain
3. Deploy the changes
4. Test download to ANY email address
5. Should work immediately!

---

## ⏱️ Timeline

- **Adding DNS records**: 5 minutes
- **DNS propagation**: 5-30 minutes
- **Code update**: 2 minutes
- **Testing**: 1 minute

**Total**: ~30-45 minutes

---

## 🆘 If You Get Stuck

**Can't find DNS records in Resend?**
- Go to Domains → Click on fatherssonmusic.com → See DNS records

**DNS records not verifying?**
- Wait 30 minutes for DNS propagation
- Check records are added correctly in Cloudflare
- Use https://mxtoolbox.com to verify DNS

**Still not working?**
- Contact Resend support (they're very responsive)
- Or let me know and I can help troubleshoot

---

Let me know when the domain is verified and I'll update the code!
