import React, { useState } from "react";
import axios from "axios";

const MakeCallButton = ({ username, password, accountSid, subDomain, myNumber, customerNumber, callerId, onActionComplete }) => {
    const [loading, setLoading] = useState(false);

    const makeCall = async () => {
        // Validation checks remain the same
        if (!username || !password || !accountSid || !subDomain) {
            alert("All credentials (username, password, accountSid, subDomain) are required.");
            return;
        }

        if (!myNumber || !customerNumber || !callerId) {
            alert("Please fill all call details (My Number, Customer Number, Caller ID).");
            return;
        }

        setLoading(true);

        // ✅ CRITICAL FIX: Combine all data, including credentials, into the payload (request body)
        const payload = {
            // Call Parameters
            From: myNumber,
            To: customerNumber,
            CallerId: callerId,
            Url: `http://localhost:5000/connect.xml`, // MANDATORY TwiML URL
            
            // Authentication & Routing Parameters (Safely in the body)
            username: username,
            password: password,
            accountSid: accountSid,
            subDomain: subDomain 
        };

        try {
            const response = await axios.post(
                `http://localhost:5000/api/make-call`,
                payload, // Send combined payload
                // ❌ DO NOT use { params: ... } here, as that exposes secrets in the URL
            );

            console.log("Call initiated:", response.data);
            alert("Call initiated successfully!");
            onActionComplete && onActionComplete();
        } catch (err) {
            console.error("Failed to make call:", err.response?.data || err.message);
            alert("Failed to initiate call. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={makeCall}
            disabled={loading}
            style={{ padding: 10, background: "#1976d2", color: "white", borderRadius: 5 }}
        >
            {loading ? "Calling..." : "Call Now"}
        </button>
    );
};

export default MakeCallButton;