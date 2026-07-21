const express = require("express");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ZOHO_FLOW_URL = process.env.ZOHO_FLOW_URL;

// Meta Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive WhatsApp Messages
app.post("/webhook", async (req, res) => {
  try {
    if (ZOHO_FLOW_URL) {
      await fetch(ZOHO_FLOW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
