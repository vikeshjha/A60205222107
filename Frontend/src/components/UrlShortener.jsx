
import React, { useState } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { logEvent } from "../middleware/logger";

function generateShortCode(len = 6) {
  const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < len; i++) code += pool[Math.floor(Math.random() * pool.length)];
  return code;
}
const isUrl = (u) => {
  try { new URL(u); return true; } catch { return false; }
};

export default function UrlShortener() {
 
  const [urls, setUrls]       = useState(Array(5).fill(""));
  const [codes, setCodes]     = useState(Array(5).fill(""));
  const [mins,  setMins]      = useState(Array(5).fill(""));
  const [error, setError]     = useState("");
  const [done,  setDone]      = useState([]);

  const onChange = (arrSetter, arr) => (i, v) => {
    const copy = [...arr]; copy[i] = v; arrSetter(copy);
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const store = JSON.parse(localStorage.getItem("affordmedUrls") || "[]");
    const taken = store.map((x) => x.shortcode);
    const fresh = [];

    for (let i = 0; i < 5; i++) {
      const long = urls[i].trim();
      if (!long) continue;

      if (!isUrl(long)) { setError(`Row ${i+1}: invalid URL`); return; }

      let sc = codes[i].trim() || generateShortCode();
      if (!/^[a-zA-Z0-9]+$/.test(sc)) { setError(`Row ${i+1}: shortcode must be alphanumeric`); return; }
      if (taken.includes(sc))         { setError(`Row ${i+1}: shortcode already used`); return; }

      taken.push(sc);
      const valid = Math.max(1, parseInt(mins[i] || "30", 10));
      const now   = Date.now();

      const entry = {
        original : long,
        shortcode: sc,
        createdAt: now,
        expiresAt: now + valid*60_000,
        clicks   : []
      };

      store.push(entry);
      fresh.push(entry);
      logEvent("ShortenSuccess", { shortcode: sc, url: long, validity: valid });
    }
    localStorage.setItem("affordmedUrls", JSON.stringify(store));
    setDone(fresh);
  };

  return (
    <Box sx={{ maxWidth: 550, mx: "auto", mt: 3 }}>
      <h2>Shorten up to 5 URLs</h2>
      <form onSubmit={submit}>
        {[0,1,2,3,4].map((i) => (
          <Paper key={i} sx={{ p: 1, mb: 1 }}>
            <TextField
              label="Long URL"
              value={urls[i]}
              onChange={(e)=>onChange(setUrls, urls)(i,e.target.value)}
              fullWidth size="small" margin="dense"
            />
            <TextField
              label="Validity (min, default 30)"
              value={mins[i]}
              type="number" size="small"
              onChange={(e)=>onChange(setMins, mins)(i,e.target.value)}
              sx={{ mr:1, width:170 }}
            />
            <TextField
              label="Shortcode (optional)"
              value={codes[i]}
              onChange={(e)=>onChange(setCodes, codes)(i,e.target.value)}
              size="small" sx={{ width:170 }}
            />
          </Paper>
        ))}
        <Button type="submit" variant="contained">Shorten</Button>
      </form>

      {error && <p style={{color:"red"}}>{error}</p>}

      {done.length>0 && (
        <Box sx={{ mt:3 }}>
          {done.map((d)=>(
            <Paper key={d.shortcode} sx={{ p:1, mb:1 }}>
              <div><b>Short:</b> {window.location.origin}/{d.shortcode}</div>
              <div><b>Original:</b> {d.original}</div>
              <div><b>Created:</b> {new Date(d.createdAt).toLocaleString()}</div>
              <div><b>Expires:</b> {new Date(d.expiresAt).toLocaleString()}</div>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
