// Run once to get your Spotify refresh token.
// Usage: node scripts/get-spotify-token.js
// Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET env vars.
//
// Add http://127.0.0.1:8888/callback to your Spotify app's Redirect URIs first.

import http from "http";
import { exec } from "child_process";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing env vars. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", SCOPES);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8888");
  if (url.pathname !== "/callback") return res.end();

  const code = url.searchParams.get("code");
  if (!code) {
    res.end("No code returned. Close this and try again.");
    server.close();
    return;
  }

  res.end("<html><body><p>Got it! You can close this tab.</p></body></html>");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (!data.refresh_token) {
    console.error("No refresh token returned:", data);
    server.close();
    return;
  }

  console.log("\nAdd these to your Vercel environment variables:\n");
  console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
  console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
  console.log("");

  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Opening Spotify login in your browser...");
  console.log("Make sure http://127.0.0.1:8888/callback is in your Spotify app's Redirect URIs.\n");
  const cmd = process.platform === "win32" ? `start "" "${authUrl}"` : `open "${authUrl}"`;
  exec(cmd);
});
