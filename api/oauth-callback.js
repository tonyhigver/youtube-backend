import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      },
    });

    const { access_token, refresh_token } = response.data;

    console.log("Access token:", access_token);
    console.log("Refresh token:", refresh_token);

    res.redirect("https://youtube-saas-frontend.vercel.app?loggedIn=true");
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Error exchanging code");
  }
}
