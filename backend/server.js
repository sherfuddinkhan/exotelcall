const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Parses JSON from client
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Required for TwiML endpoint

// ------------------------------
// 1️⃣ MAKE CALL
// ------------------------------
 // 1️⃣ MAKE CALL (SECURE PROXY to Exotel)
// ------------------------------
 // ------------------------------
//  Trigger Exotel Call
// ------------------------------
app.post("/api/make-call", async (req, res) => {
  const { username, password, fromNumber, toNumber, callerId } = req.body;

  if (!username || !password || !fromNumber || !toNumber || !callerId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("From", fromNumber);
    formData.append("To", toNumber);
    formData.append("callerId", callerId);
    formData.append("record", "true");

    const response = await axios.post(
      "https://api.exotel.com/v1/Accounts/calibrecueitsolutions1/Calls/connect",
      formData,
      {
        auth: { username, password },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Backend error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: error.message });
  }
});

// ------------------------------
// 2️⃣ GET CALL HISTORY
// ------------------------------
app.get("/api/call-history", async (req, res) => {
    const { username, password, accountSid, subDomain, startDate, endDate } = req.query;

    if (!username || !password || !accountSid || !subDomain) {
        return res.status(400).json({ error: "Missing credentials, AccountSid or SubDomain" });
    }

    try {
        let url = `https://${subDomain}/v1/Accounts/${accountSid}/Calls.json`;
        if (startDate && endDate) {
            url += `?StartTime=${startDate}&EndTime=${endDate}`;
        }

        const response = await axios.get(url, {
            auth: { username, password },
        });

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Exotel API error" });
    }
});

// ------------------------------
// 3️⃣ GET CALL DETAILS
// ------------------------------
app.get("/api/call-details/:sid", async (req, res) => {
    const { username, password, accountSid, subDomain } = req.query;
    const callSid = req.params.sid;

    if (!username || !password || !accountSid || !subDomain) {
        return res.status(400).json({ error: "Missing credentials, AccountSid or SubDomain" });
    }

    try {
        const url = `https://${subDomain}/v1/Accounts/${accountSid}/Calls/${callSid}.json`;
        const response = await axios.get(url, {
            auth: { username, password },
        });

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Exotel API error" });
    }
});

// ------------------------------
// 4️⃣ CONNECT.XML (TwiML)
// ------------------------------
//4️⃣// CONNECT.XML (TwiML Endpoint - Called by Exotel)
// ------------------------------
app.post("/connect.xml", (req, res) => {
    // Exotel sends 'To' (customer number) in the URL-encoded body
    const { To } = req.body; 

    const xmlResponse = `
        <Response>
            <Say voice="alice">Connecting your call now.</Say>
            <Dial>${To}</Dial>
        </Response>
    `.trim();

    res.header("Content-Type", "application/xml");
    res.send(xmlResponse);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
