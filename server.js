const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve your HTML

/* ---- DB ---- */
const raws = {}; 
// raws[id] = { code }

/* ---- CREATE RAW ---- */
app.post("/api/create", (req, res) => {
    const { code } = req.body;

    if (!code) return res.json({ error: "No code provided" });

    const id = crypto.randomBytes(8).toString("hex");
    raws[id] = { code };

    const fullUrl = `${req.protocol}://${req.get("host")}/raw/${id}`;

    res.json({ url: fullUrl });
});

/* ---- RAW ACCESS ---- */
app.get("/raw/:id", (req, res) => {
    const id = req.params.id;

    if (!raws[id]) return res.status(404).send("Invalid RAW ID.");

    const ua = req.headers["user-agent"] || "";

    const isRoblox =
        ua.includes("Roblox") ||
        ua.includes("HttpService") ||
        ua.includes("Game") ||
        ua === ""; // Roblox sometimes sends empty UA

    if (isRoblox) {
        res.setHeader("Content-Type", "text/plain");
        return res.send(raws[id].code);
    }

    res.setHeader("Content-Type", "text/plain");
    res.send("ANO SKID PA?");
});

/* ---- SERVER START ---- */
app.listen(3000, () => console.log("Server running on port 3000"));
