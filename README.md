# Flood Relief Registration System

A comprehensive web-based registration system for managing flood relief efforts across Sri Lanka.

## Features

### 📋 Four Main Sections

1. **Donor Registration**
   - Register donations (items and quantities)
   - View real-time needs from affected areas
   - Filter needs by district
   - GPS location tracking

2. **Transport Provider Registration**
   - Register available vehicles
   - **Home district** (base location)
   - **Service districts** (multiple districts they can deliver to)
   - Vehicle type and capacity information
   - Availability status
   - GPS location tracking

3. **Affected People Registration**
   - Report urgent needs
   - Number of people affected
   - Current situation details
   - GPS location tracking

4. **🚚 Coordinate Delivery (NEW)**
   - Match donors with transport providers and affected people
   - Step-by-step coordination wizard
   - Automatic SMS notifications to transport providers
   - Complete delivery tracking

### 🎯 Key Functionality

#### For Donors:
- **Live Needs Dashboard**: See what affected people need in real-time
- **District Filtering**: Focus on specific areas
- **Auto-Refresh**: Get the latest urgent needs
- **Formatted Display**: Easy-to-read cards showing:
  - District and contact information
  - Number of people affected
  - Urgent items needed with quantities
  - GPS location
  - Situation details

#### For Coordinators:
- **4-Step Coordination Process**:
  1. Select district
  2. Choose affected person (sorted by highest need - most people affected)
  3. Select matching donor from the district
  4. Choose available transport provider
- **Smart Matching**: Only shows resources from the selected district
- **Instant SMS Notification**: Transport provider receives all details via SMS
- **Complete Summary**: Review all details before confirming

#### Data Management:
- All data automatically stored in Google Sheets
- Separate sheets for each form type:
  - `DonorResponses`
  - `TransportResponses`
  - `AffectedResponses`
  - `CoordinationLog` (tracks all coordinations)
- Automatic sorting:
  - Affected people by people count (highest need first)
  - All submissions by timestamp (most recent first)
- Auto-formatted needs display

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Go to **Extensions → Apps Script**
3. Copy the contents of `Code.gs` into the script editor
4. Save the project

### 2. Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**
2. Choose **Web app** as the deployment type
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web app URL**

### 3. Update HTML File

1. Open `index.html`
2. Find the line: `const scriptURL = "..."`
3. Replace with your Web app URL
4. Save the file

### 4. Host the HTML

Upload `index.html` to your web hosting service or use it locally.

## Google Sheets Structure

### DonorResponses Sheet
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | Name |
| C | Phone |
| D | Second Phone |
| E | District |
| F | Donations |
| G | GPS |
| H | Notes |

### TransportResponses Sheet
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | Name/Organization |
| C | Phone |
| D | Second Phone |
| E | Home District |
| F | Service Districts |
| G | Vehicle Type |
| H | Vehicle Capacity |
| I | GPS |
| J | Availability |
| K | Notes |

### AffectedResponses Sheet
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | Name |
| C | Phone |
| D | Second Phone |
| E | District |
| F | GPS |
| G | People Count |
| H | Urgent Needs |
| I | Situation/Notes |

### CoordinationLog Sheet (NEW)
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | District |
| C | Affected Name |
| D | Affected Phone |
| E | Affected Needs |
| F | Donor Name |
| G | Donor Phone |
| H | Donations |
| I | Transport Name |
| J | Transport Phone |
| K | Vehicle Type |
| L | SMS Status |

## Data Format

### Donations/Needs Format
Items are stored as: `ItemName_Quantity;`

Example: `FoodPacks_10;WaterBottles_5;Clothes_20;`

This is automatically formatted for display as: "Food Packs (10), Water Bottles (5), Clothes (20)"

## API Endpoints

### POST Request (Submit Forms)
```javascript
{
  "type": "donor|transport|affected|coordination",
  // ... other form fields
}
```

### GET Request (Fetch Needs)
```
?action=getNeeds
```
Returns JSON array of all affected people's needs, sorted by most recent.

### GET Request (Fetch Coordination Data)
```
?action=getCoordinationData&district=<district_name>
```
Returns JSON object with affected people, donors, and transport providers for the specified district.

## SMS Integration

The system includes SMS notification functionality for transport providers. To enable SMS:

### Option 1: Twilio (International)
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get Account SID, Auth Token, and Phone Number
3. Update the `sendSMS` function in `Code.gs` with your credentials
4. Uncomment the Twilio API code

### Option 2: Dialog Axiata (Sri Lanka)
1. Contact Dialog Axiata for SMS Gateway API access
2. Get API credentials
3. Update the `sendSMS` function with Dialog API endpoint

### Option 3: Mobitel (Sri Lanka)
1. Contact Mobitel for SMS API access
2. Configure API credentials
3. Update the `sendSMS` function accordingly

**Current Status**: SMS message is prepared and logged. Actual sending requires API configuration.

## Features in Detail

### Real-Time Needs Display
- Automatically loads when donor page is opened
- Refresh button to get latest updates
- District filter for targeted viewing
- Color-coded display with emoji indicators

### GPS Location
- One-click location capture
- Stores latitude and longitude
- Helps coordinate relief efforts

### Responsive Design
- Works on mobile, tablet, and desktop
- Tab-based navigation
- Clean, user-friendly interface

## Districts Covered

All 25 districts of Sri Lanka:
Ampara, Anuradhapura, Badulla, Batticaloa, Colombo, Galle, Gampaha, Hambantota, Jaffna, Kalutara, Kandy, Kegalle, Kilinochchi, Kurunegala, Mannar, Matale, Matara, Monaragala, Mullaitivu, Nuwara Eliya, Polonnaruwa, Puttalam, Ratnapura, Trincomalee, Vavuniya

## Technical Details

- **Frontend**: Pure HTML, CSS, JavaScript
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **API**: RESTful JSON API

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Support

For issues or questions, check the code comments or review the Apps Script logs in Google Apps Script editor.
