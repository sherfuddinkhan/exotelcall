import React, { useState } from "react";
import axios from "axios";

const MakeCallButton = ({
  username,
  password,
  accountSid,
  subDomain,
  fromNumber,
  toNumber,
  callerId,
  onCallComplete
}) => {
  const [loading, setLoading] = useState(false);

  const makeCall = async () => {
    if (!username || !password ||  !fromNumber || !toNumber || !callerId) {
      alert("All fields required (username, password, accountSid, subDomain, fromNumber, toNumber, callerId)");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/make-call", {
        username,
        password,
        //accountSid,
        //subDomain,
        fromNumber,
        toNumber,
        callerId,
      });

      console.log("Call initiated:", response.data);
      alert("Call initiated successfully!");

      onCallComplete && onCallComplete();
    } catch (err) {
      console.error(err);
      alert("Call failed — check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={makeCall}
      disabled={loading}
      style={{
        padding: 10,
        background: "#1976d2",
        color: "white",
        borderRadius: 5,
        cursor: "pointer",
      }}
    >
      {loading ? "Calling..." : "Call Now"}
    </button>
  );
};

export default MakeCallButton;
