import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/oauth-callback", async (req, res) => {
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

    // Guardar tokens de forma segura (DB o similar)
    console.log("Access token:", access_token);
    console.log("Refresh token:", refresh_token);

    // Redirigir a frontend ya logueado
    res.redirect("https://youtube-saas-frontend.vercel.app?loggedIn=true");
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Error exchanging code");
  }
});

// 🔥 Cambiado: usar puerto de entorno o 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
