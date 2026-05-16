export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return res.status(500).json({ error: "Spotify credentials not configured." });
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return res.status(500).json({ error: "Failed to refresh Spotify token." });
  }

  const auth = { Authorization: `Bearer ${tokenData.access_token}` };

  const [currentRes, recentRes] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers: auth }),
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=8", { headers: auth }),
  ]);

  const current = currentRes.status === 204 ? null : await currentRes.json();
  const recent = await recentRes.json();

  return res.status(200).json({
    isPlaying: current?.is_playing ?? false,
    nowPlaying: current?.item ?? recent?.items?.[0]?.track ?? null,
    recent: recent?.items ?? [],
  });
}
