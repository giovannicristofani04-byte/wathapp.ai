const axios = require("axios");

app.post("/webhook", async (req, res) => {
  console.log("POST ricevuta:");
  console.dir(req.body, { depth: null });

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const from = message.from;
      const text = message.text?.body;

      console.log("Messaggio ricevuto:", text);

      // 👉 RISPOSTA (per ora semplice)
      const reply = `Hai scritto: ${text}`;

      await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Risposta inviata");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Errore:", error.response?.data || error.message);
    res.sendStatus(200);
  }
});
