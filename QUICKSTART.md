# 🚀 Quick Start: Location Detection Feature

## ⚡ 3-Step Setup (5 minutes)

### 1️⃣ Get API Key
1. Go to https://console.cloud.google.com/
2. Enable "Geocoding API"
3. Create API Key
4. Copy the key

### 2️⃣ Update Code
Open `index.html` → Line 7 → Replace placeholder:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

### 3️⃣ Update Sheets
Add these columns to your Google Sheets:

**DonorResponses:** (after Notes)
- DS Division | GN Division | Road Name | Full Address

**TransportResponses:** (after Notes)
- DS Division | GN Division | Road Name | Full Address

**AffectedResponses:** (after Situation/Notes)
- DS Division | GN Division | Road Name | Full Address

---

## ✅ Testing (2 minutes)

1. Open `index.html` in browser
2. Click "Get My Location"
3. Allow location access
4. Verify green box shows:
   - ✅ District
   - ✅ DS Division
   - ✅ GN Division
   - ✅ Road name
   - ✅ Full address
5. Submit form
6. Check Google Sheets for location data

---

## 📊 What You Get

### Before (Old System)
- ❌ Only GPS coordinates
- ❌ Manual district selection
- ❌ No GN Division info
- ❌ Hard to find nearby resources

### After (New System)
- ✅ Automatic District detection
- ✅ DS Division identified
- ✅ GN Division displayed
- ✅ Road name captured
- ✅ Full formatted address
- ✅ Location tags in browse interface
- ✅ Easy local coordination

---

## 💰 Cost

**Google Maps Geocoding API:**
- Free tier: $200 monthly credit
- Cost: $5 per 1,000 requests
- **40,000 FREE requests/month**

**Your Usage:**
- Average disaster: 500-1,000 registrations
- Cost per disaster: **$0 (free tier)**
- Even 5,000 registrations: Only $25

**Verdict:** FREE for typical usage! 🎉

---

## 🎯 Use Cases

### Donors
"Show me victims in **my GN Division**"
→ Find people in walking distance

### Victims
"Which donors are in **Maradana GN**?"
→ Contact local donors first

### Transport
"I'm in **Colombo GN**, pick up from same area"
→ Efficient route planning

---

## 🔒 Security Checklist

- [ ] API key restricted to your domain
- [ ] API key limited to Geocoding API only
- [ ] Billing alerts set up (optional)
- [ ] API key NOT in public repository

---

## ⚠️ Troubleshooting

**"Google is not defined" error:**
→ Check API key in line 7

**"Geocoding failed" alert:**
→ Enable Geocoding API in Google Cloud Console
→ Verify billing is enabled (even for free tier)

**GN Division shows "Not detected":**
→ Normal for remote/rural areas
→ DS Division and full address still captured

---

## 📁 Files Changed

✅ `index.html` - Added location detection UI & functions  
✅ `Code.gs` - Backend handles location columns  
✅ `LOCATION_DETECTION_SETUP.md` - Full documentation  
✅ `QUICKSTART.md` - This file

---

## 🎉 Ready to Go!

After completing 3-step setup above:
1. Deploy Code.gs to Google Apps Script
2. Test location detection in browser
3. Verify data appears in Google Sheets
4. Celebrate! 🎊

---

**Need help?** See full guide: `LOCATION_DETECTION_SETUP.md`

**Commit:** e946238  
**Date:** 2024
