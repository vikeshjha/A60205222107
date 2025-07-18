import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logEvent } from "../middleware/logger";

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const [msg, setMsg] = useState("Redirecting...");

  useEffect(() => {
    let arr = JSON.parse(localStorage.getItem("affordmedUrls") || "[]");
    let item = arr.find(u => u.shortcode === shortcode);

    if (!item) {
      setMsg("Invalid or unknown short URL.");
      logEvent("RedirectFailed", { shortcode });
      return;
    }
    if (Date.now() > item.expiresAt) {
      setMsg("This link has expired.");
      logEvent("RedirectFailedExpired", { shortcode });
      return;
    }

    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        let click = {
          timestamp: Date.now(),
          referrer: document.referrer,
          location: data.country || "Unknown"
        };
        item.clicks = item.clicks || [];
        item.clicks.push(click);
        localStorage.setItem("affordmedUrls",
          JSON.stringify(arr.map(u => u.shortcode === shortcode ? item : u))
        );
        logEvent("RedirectSuccess", { shortcode });
        setTimeout(() => { window.location.href = item.original }, 1000);
      })
      .catch(() => {
        setTimeout(() => { window.location.href = item.original }, 1000);
      });
  }, [shortcode]);

  return (
    <div style={{ textAlign: "center", marginTop: 70 }}>
      <h2>{msg}</h2>
    </div>
  );
}
