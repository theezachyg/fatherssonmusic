# Stripe Tax Setup Guide
## Automatic Sales Tax Collection for Fathers Son Music

---

## ✅ Code Changes (Already Completed)

The following features have been added to your checkout sessions:

- **Billing address collection** - Required for tax calculation
- **Automatic tax calculation** - Stripe Tax enabled
- **Tax behavior** - Set to "exclusive" (tax added on top of price)

This applies to:
- Donation checkouts (`create-donation-checkout.js`)
- Song download checkouts (`create-download-checkout.js`)

---

## 🚀 Enable Stripe Tax in Dashboard

You need to activate Stripe Tax in your Stripe account to start collecting sales tax.

### Step 1: Access Stripe Dashboard

1. Log in to your Stripe account at https://dashboard.stripe.com
2. Navigate to **Settings** (gear icon in top right)
3. Click **Tax** in the left sidebar

### Step 2: Activate Stripe Tax

1. Click **Activate** on the Stripe Tax page
2. Review the pricing:
   - **0.5% of each transaction** + regular Stripe fees
   - Example: $10 sale = $0.05 tax calculation fee
3. Click **Activate Stripe Tax**

### Step 3: Configure Tax Settings

1. **Product Tax Codes**:
   - Your products are automatically categorized
   - Digital goods (downloads): Auto-detected
   - Services (donations): Auto-detected

2. **Tax Registration**:
   - Add the states/countries where you have tax nexus
   - Click **Add registration**
   - Select your state(s)
   - Enter your tax ID (if you have one)

3. **Filing Settings** (Optional):
   - Stripe can file tax returns for you automatically
   - Set up if you want automated tax filing

### Step 4: Test Tax Collection

1. Make a test purchase:
   - Use Stripe test mode
   - Use test card: `4242 4242 4242 4242`
   - Enter a billing address in a state where tax applies

2. Verify tax appears on checkout:
   - You should see "Tax" line item
   - Tax amount should calculate automatically

---

## 📊 How It Works

### Customer Experience

1. Customer clicks **Download** or **Donate**
2. Enters payment details on Stripe Checkout
3. Enters **billing address** (required)
4. **Sales tax automatically calculates** based on address
5. Shows subtotal + tax = total
6. Customer completes payment

### Tax Calculation

Stripe Tax automatically:
- ✅ Determines tax rate based on billing address
- ✅ Calculates correct amount for digital goods/services
- ✅ Handles state, county, and city taxes
- ✅ Updates rates when laws change
- ✅ Applies tax exemptions (if customer provides certificate)

### Example Checkout

```
Download: Message in the Song     $10.00
Tax (California)                   $0.93
─────────────────────────────────────────
Total                             $10.93
```

---

## 🌎 Tax Nexus - Where to Register

You need to register for sales tax collection in states where you have **nexus** (tax obligation).

### Common Nexus Triggers

1. **Physical presence** - Where your business is located
2. **Economic nexus** - Sales threshold in a state:
   - Most states: $100,000+ in sales OR 200+ transactions
   - Some states: Lower thresholds

### Recommendation

**Start simple:**
1. Register in **your home state** first
2. Monitor sales by state in Stripe Dashboard
3. Add more states when you approach nexus thresholds

**Stripe Tax Settings** → **Registrations** → **Add registration**

---

## 💼 Tax Filing

Stripe can automatically file your sales tax returns:

1. Go to **Settings** → **Tax**
2. Click **Filing**
3. Choose states for automatic filing
4. Stripe files and remits taxes on your behalf

**Cost**: Varies by state, typically $50-150/month per state

---

## 🧪 Testing

### Test Mode Addresses

Use these addresses to test tax calculation:

**California (Sales Tax ~9%)**
```
Address: 123 Main St
City: Los Angeles
State: CA
ZIP: 90001
```

**Texas (Sales Tax ~8%)**
```
Address: 456 Oak Ave
City: Austin
State: TX
ZIP: 73301
```

**Oregon (No Sales Tax)**
```
Address: 789 Pine Rd
City: Portland
State: OR
ZIP: 97201
```

### Test Cards

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- Any future expiry date
- Any CVC

---

## 📱 What Customers See

### Before (Without Tax)
```
Donation to Fathers Son Music    $25.00
Total                            $25.00
```

### After (With Tax)
```
Donation to Fathers Son Music    $25.00
Tax (Sales Tax - California)      $2.31
─────────────────────────────────────────
Total                            $27.31
```

---

## ⚠️ Important Notes

1. **Digital Products**:
   - Song downloads are taxable in most states
   - Stripe Tax handles digital goods classification

2. **Donations**:
   - May or may not be taxable depending on your 501(c)(3) status
   - If you're a registered nonprofit, you may be exempt
   - Contact Stripe support to configure exemptions

3. **International Sales**:
   - Stripe Tax supports 40+ countries
   - VAT/GST automatically calculated for EU, UK, Australia, etc.

4. **Receipts**:
   - Customers receive email receipts showing tax breakdown
   - Tax amount is clearly itemized

---

## 🆘 Troubleshooting

### Tax Not Showing Up?

1. **Check Stripe Tax is activated**:
   - Dashboard → Settings → Tax → Status should be "Active"

2. **Verify test mode matches**:
   - If testing, use test API keys and test mode in dashboard

3. **Check billing address**:
   - Tax only calculates when customer enters billing address
   - Address must be in a registered tax location

### Tax Amount Seems Wrong?

- Stripe Tax uses official tax rates
- Rates include state + county + city taxes
- Rates update automatically when laws change

### Need Help?

- **Stripe Tax Documentation**: https://stripe.com/docs/tax
- **Stripe Support**: https://support.stripe.com
- **Tax Questions**: Consult a tax professional for specific advice

---

## 🎯 Quick Checklist

- [ ] Activate Stripe Tax in dashboard
- [ ] Add tax registration for your home state
- [ ] Make test purchase to verify tax calculation
- [ ] Update success.html to show tax breakdown (optional)
- [ ] Monitor tax reports in Stripe Dashboard
- [ ] Consider automatic tax filing when volume increases

---

## 📈 Monitoring Tax Collection

### Stripe Dashboard

1. **Tax Reports**:
   - Settings → Tax → Reports
   - View tax collected by location
   - Export tax liability reports

2. **Payment Details**:
   - Each payment shows tax breakdown
   - Filter by tax amounts
   - See effective tax rates

3. **Tax Summary**:
   - Monthly tax collection totals
   - Breakdown by jurisdiction
   - Ready for tax filing

---

✅ **Your code is ready! Just activate Stripe Tax in your dashboard to start collecting sales tax automatically.**

**Next Steps:**
1. Log in to Stripe Dashboard
2. Activate Stripe Tax (Settings → Tax)
3. Add your state tax registration
4. Test with a sample purchase
5. Deploy and start collecting tax automatically!
