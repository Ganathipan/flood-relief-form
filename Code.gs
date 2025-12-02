function doGet(e) {
  // Check if this is a request for needs data
  if (e && e.parameter && e.parameter.action === 'getNeeds') {
    return getNeedsData();
  }
  
  // Check if this is a request for donors data
  if (e && e.parameter && e.parameter.action === 'getDonors') {
    return getDonorsData();
  }
  
  // Check if this is a request for coordination data (deprecated but kept for compatibility)
  if (e && e.parameter && e.parameter.action === 'getCoordinationData') {
    return getCoordinationData(e.parameter.district);
  }
  
  return ContentService
    .createTextOutput("Flood Relief Registration API is running")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getNeedsData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("AffectedResponses");
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    
    // Skip header row
    var needs = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      
      // Format the needs string for display
      var needsString = row[7] || ""; // Column H: Urgent Needs
      var needsFormatted = formatNeedsString(needsString);
      
      needs.push({
        timestamp: formatDate(row[0]),     // A: Timestamp
        name: row[1] || "",                // B: Name
        phone: row[2] || "",               // C: Phone
        phone2: row[3] || "",              // D: Second Phone
        district: row[4] || "",            // E: District
        gps: row[5] || "",                 // F: GPS
        peopleCount: row[6] || "",         // G: People Count
        needs: needsString,                // H: Urgent Needs (raw)
        needsFormatted: needsFormatted,    // H: Urgent Needs (formatted)
        notes: row[8] || "",               // I: Situation/Notes
        dsDivision: row[9] || "",          // J: DS Division
        gnDivision: row[10] || "",         // K: GN Division
        roadName: row[11] || "",           // L: Road Name
        fullAddress: row[12] || ""         // M: Full Address
      });
    }
    
    // Sort by timestamp (most recent first)
    needs.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    return ContentService
      .createTextOutput(JSON.stringify(needs))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("Error in getNeedsData: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getDonorsData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DonorResponses");
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    
    // Skip header row
    var donors = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      
      // Format the donations string for display
      var donationsString = row[5] || ""; // Column F: Donations
      var donationsFormatted = formatNeedsString(donationsString);
      
      donors.push({
        timestamp: formatDate(row[0]),        // A: Timestamp
        name: row[1] || "",                   // B: Name
        phone: row[2] || "",                  // C: Phone
        phone2: row[3] || "",                 // D: Second Phone
        district: row[4] || "",               // E: District
        donations: donationsString,           // F: Donations (raw)
        donationsFormatted: donationsFormatted, // F: Donations (formatted)
        gps: row[6] || "",                    // G: GPS
        notes: row[7] || "",                  // H: Notes
        dsDivision: row[8] || "",             // I: DS Division
        gnDivision: row[9] || "",             // J: GN Division
        roadName: row[10] || "",              // K: Road Name
        fullAddress: row[11] || ""            // L: Full Address
      });
    }
    
    // Sort by timestamp (most recent first)
    donors.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    return ContentService
      .createTextOutput(JSON.stringify(donors))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("Error in getDonorsData: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatNeedsString(needsString) {
  if (!needsString) return "";
  
  // Convert "FoodPacks_10;WaterBottles_5;" to "Food Packs (10), Water Bottles (5)"
  var items = needsString.split(";").filter(function(item) { return item.trim() !== ""; });
  var formatted = items.map(function(item) {
    var parts = item.split("_");
    if (parts.length === 2) {
      // Add spaces before capital letters: "FoodPacks" -> "Food Packs"
      var itemName = parts[0].replace(/([A-Z])/g, ' $1').trim();
      var qty = parts[1];
      return itemName + " (" + qty + ")";
    }
    return item;
  });
  
  return formatted.join(", ");
}

function formatDate(date) {
  if (!date) return "";
  
  var d = new Date(date);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  var year = d.getFullYear();
  var hours = ("0" + d.getHours()).slice(-2);
  var minutes = ("0" + d.getMinutes()).slice(-2);
  
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
}

function getCoordinationData(district) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get affected people from district
    var affectedSheet = ss.getSheetByName("AffectedResponses");
    var affected = [];
    if (affectedSheet) {
      var affectedData = affectedSheet.getDataRange().getValues();
      for (var i = 1; i < affectedData.length; i++) {
        var row = affectedData[i];
        if (row[4] === district) { // District column
          affected.push({
            timestamp: formatDate(row[0]),
            name: row[1] || "",
            phone: row[2] || "",
            phone2: row[3] || "",
            district: row[4] || "",
            gps: row[5] || "",
            peopleCount: row[6] || "",
            needs: row[7] || "",
            needsFormatted: formatNeedsString(row[7]),
            notes: row[8] || ""
          });
        }
      }
    }
    
    // Get donors from district
    var donorSheet = ss.getSheetByName("DonorResponses");
    var donors = [];
    if (donorSheet) {
      var donorData = donorSheet.getDataRange().getValues();
      for (var i = 1; i < donorData.length; i++) {
        var row = donorData[i];
        if (row[4] === district) { // District column
          donors.push({
            timestamp: formatDate(row[0]),
            name: row[1] || "",
            phone: row[2] || "",
            phone2: row[3] || "",
            district: row[4] || "",
            donations: row[5] || "",
            donationsFormatted: formatNeedsString(row[5]),
            gps: row[6] || "",
            notes: row[7] || ""
          });
        }
      }
    }
    
    // Get transport providers from district
    var transportSheet = ss.getSheetByName("TransportResponses");
    var transports = [];
    if (transportSheet) {
      var transportData = transportSheet.getDataRange().getValues();
      for (var i = 1; i < transportData.length; i++) {
        var row = transportData[i];
        var serviceDistricts = row[5] || ""; // Column F: Service Districts
        // Check if the requested district is in the service districts list
        if (serviceDistricts.indexOf(district) !== -1) {
          transports.push({
            timestamp: formatDate(row[0]),
            name: row[1] || "",
            phone: row[2] || "",
            phone2: row[3] || "",
            homeDistrict: row[4] || "",
            serviceDistricts: row[5] || "",
            vehicleType: row[6] || "",
            vehicleCapacity: row[7] || "",
            gps: row[8] || "",
            availability: row[9] || "",
            notes: row[10] || ""
          });
        }
      }
    }
    
    // Sort affected by people count (highest first)
    affected.sort(function(a, b) {
      return parseInt(b.peopleCount) - parseInt(a.peopleCount);
    });
    
    var result = {
      affected: affected,
      donors: donors,
      transports: transports
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("Error in getCoordinationData: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({affected: [], donors: [], transports: []}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleCoordination(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("CoordinationLog");
    
    if (!sheet) {
      sheet = ss.insertSheet("CoordinationLog");
      sheet.appendRow([
        "Timestamp", "District", 
        "Affected Name", "Affected Phone", "Affected Needs",
        "Donor Name", "Donor Phone", "Donations",
        "Transport Name", "Transport Phone", "Vehicle Type", "SMS Status"
      ]);
    }
    
    // Log the coordination
    sheet.appendRow([
      new Date(),
      data.district,
      data.affected.name,
      data.affected.phone,
      data.affected.needsFormatted,
      data.donor.name,
      data.donor.phone,
      data.donor.donationsFormatted,
      data.transport.name,
      data.transport.phone,
      data.transport.vehicleType,
      "Pending"
    ]);
    
    // Send SMS notification to transport provider
    var smsStatus = sendSMS(data);
    
    // Update SMS status
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 12).setValue(smsStatus);
    
    return ContentService
      .createTextOutput("Coordination logged successfully. " + smsStatus)
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    Logger.log("Error in handleCoordination: " + error.toString());
    return ContentService
      .createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function sendSMS(data) {
  try {
    // SMS message content
    var message = "FLOOD RELIEF COORDINATION\n\n";
    message += "You have been selected to transport donations!\n\n";
    message += "PICKUP FROM:\n";
    message += "Donor: " + data.donor.name + "\n";
    message += "Phone: " + data.donor.phone + "\n";
    message += "Items: " + data.donor.donationsFormatted + "\n";
    if (data.donor.gps) message += "Location: " + data.donor.gps + "\n";
    message += "\nDELIVER TO:\n";
    message += "Recipient: " + data.affected.name + "\n";
    message += "Phone: " + data.affected.phone + "\n";
    message += "District: " + data.district + "\n";
    if (data.affected.gps) message += "Location: " + data.affected.gps + "\n";
    message += "\nPlease contact the donor to arrange pickup.";
    
    // NOTE: To actually send SMS, you need to integrate with an SMS service
    // Options include:
    // 1. Twilio API
    // 2. Dialog Axiata SMS Gateway (Sri Lanka)
    // 3. Mobitel SMS API (Sri Lanka)
    // 4. Any other SMS gateway service
    
    // Example with Twilio (you need to set up Twilio account and add credentials):
    /*
    var accountSid = "YOUR_TWILIO_ACCOUNT_SID";
    var authToken = "YOUR_TWILIO_AUTH_TOKEN";
    var fromNumber = "YOUR_TWILIO_PHONE_NUMBER";
    var toNumber = data.transport.phone;
    
    var url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
    var payload = {
      "To": toNumber,
      "From": fromNumber,
      "Body": message
    };
    
    var options = {
      "method": "post",
      "payload": payload,
      "headers": {
        "Authorization": "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
      }
    };
    
    var response = UrlFetchApp.fetch(url, options);
    return "SMS Sent Successfully";
    */
    
    // For now, just log the message
    Logger.log("SMS to " + data.transport.phone + ": " + message);
    
    return "SMS notification prepared (SMS service not configured). Check logs for message content.";
    
  } catch (error) {
    Logger.log("Error sending SMS: " + error.toString());
    return "SMS Error: " + error.toString();
  }
}

function doPost(e) {
  // Protect against empty POST
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService
      .createTextOutput("No POST data received")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    // Parse JSON coming from the HTML page
    var data = JSON.parse(e.postData.contents);

    // DEBUG: see exactly what came from the form
    Logger.log("Received: " + JSON.stringify(data));

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName;
    var rowData;

    // Route to appropriate sheet based on form type
    switch(data.type) {
      case "donor":
        sheetName = "DonorResponses";
        rowData = [
          new Date(),        // A: Timestamp
          data.name,         // B: Name
          data.phone,        // C: Phone
          data.phone2,       // D: Second Phone Number (Optional)
          data.district,     // E: District
          data.donations,    // F: Donations (string like FoodPacks_10;WaterBottles_5;)
          data.gps,          // G: GPS ("lat, lng")
          data.notes,        // H: Notes
          data.dsDivision || "",   // I: DS Division
          data.gnDivision || "",   // J: GN Division
          data.roadName || "",     // K: Road Name
          data.fullAddress || ""   // L: Full Address
        ];
        break;

      case "transport":
        sheetName = "TransportResponses";
        rowData = [
          new Date(),            // A: Timestamp
          data.name,             // B: Name/Organization
          data.phone,            // C: Phone
          data.phone2,           // D: Second Phone Number (Optional)
          data.homeDistrict,     // E: Home District
          data.serviceDistricts, // F: Service Districts (comma-separated)
          data.vehicleType,      // G: Vehicle Type
          data.vehicleCapacity,  // H: Vehicle Capacity
          data.gps,              // I: GPS ("lat, lng")
          data.availability,     // J: Availability
          data.notes,            // K: Notes
          data.dsDivision || "", // L: DS Division
          data.gnDivision || "", // M: GN Division
          data.roadName || "",   // N: Road Name
          data.fullAddress || "" // O: Full Address
        ];
        break;

      case "affected":
        sheetName = "AffectedResponses";
        rowData = [
          new Date(),        // A: Timestamp
          data.name,         // B: Name
          data.phone,        // C: Phone
          data.phone2,       // D: Second Phone Number (Optional)
          data.district,     // E: District
          data.gps,          // F: GPS ("lat, lng")
          data.peopleCount,  // G: Number of People Affected
          data.needs,        // H: Urgent Needs (string like FoodPacks_10;WaterBottles_5;)
          data.notes,        // I: Current Situation/Additional Info
          data.dsDivision || "",   // J: DS Division
          data.gnDivision || "",   // K: GN Division
          data.roadName || "",     // L: Road Name
          data.fullAddress || ""   // M: Full Address
        ];
        break;

      default:
        return ContentService
          .createTextOutput("Error: Unknown form type")
          .setMimeType(ContentService.MimeType.TEXT);
    }

    // Handle coordination submissions
    if (data.type === "coordination") {
      return handleCoordination(data);
    }

    // Get or create the appropriate sheet
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      
      // Add headers based on sheet type
      var headers;
      switch(sheetName) {
        case "DonorResponses":
          headers = ["Timestamp", "Name", "Phone", "Second Phone", "District", "Donations", "GPS", "Notes", "DS Division", "GN Division", "Road Name", "Full Address"];
          break;
        case "TransportResponses":
          headers = ["Timestamp", "Name/Organization", "Phone", "Second Phone", "Home District", "Service Districts", "Vehicle Type", "Vehicle Capacity", "GPS", "Availability", "Notes", "DS Division", "GN Division", "Road Name", "Full Address"];
          break;
        case "AffectedResponses":
          headers = ["Timestamp", "Name", "Phone", "Second Phone", "District", "GPS", "People Count", "Urgent Needs", "Situation/Notes", "DS Division", "GN Division", "Road Name", "Full Address"];
          break;
      }
      sheet.appendRow(headers);
    }

    // Append the data row
    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput("Success: " + sheetName + " updated")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService
      .createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
