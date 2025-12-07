import express from "express";
import fetch from "node-fetch";  // important if not already installed: npm install node-fetch@2

const router = express.Router();

router.post("/", async (req, res) => {
    const { text, from, to } = req.body;
    console.log(text+" "+from+" "+to);
    if (!text || !from || !to) {
        return res.status(400).json({ error: "text, from, to are required" });
    }

    try {
        const response = await fetch("http://127.0.0.1:6000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                src_lang: from,
                tgt_lang: to,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data.error || "Unknown error" });
        }

        res.json({ translatedText: data.translated_text });

    } catch (err) {
        console.error("Backend request failed:", err);
        res.status(500).json({ error: "Failed to translate" });
    }
});

export default router;
