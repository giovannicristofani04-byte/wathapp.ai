const express = require("express");

const app = express();

// Railway assegna la porta tramite variabile d'ambiente.
// In locale usiamo 3000 come fallback.
const PORT = process.env.PORT || 3000;

// Token usato da Meta per verificare il webhook.
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Middleware per leggere body JSON inviati da WhatsApp Cloud API.
app.use(express.json());

// Endpoint base per controllare rapidamente se il server e' attivo.
app.get("/", (req, res) => {
  res.send("Server online");
});

// Endpoint di verifica webhook richiesto da Meta.
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // Meta richiede di restituire ESATTAMENTE il challenge come testo.
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Endpoint che riceve gli eventi WhatsApp.
app.post("/webhook", (req, res) => {
  // Log completo del body per debug e sviluppo.
  console.log("Webhook ricevuto:");
  console.log(JSON.stringify(req.body, null, 2));

  // Risposta veloce per confermare subito la ricezione.
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  if (!VERIFY_TOKEN) {
    console.warn("ATTENZIONE: VERIFY_TOKEN non e' impostato nelle variabili d'ambiente.");
  }

  console.log(`Server in ascolto sulla porta ${PORT}`);
});
