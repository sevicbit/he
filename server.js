const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");

const app = express();

// serve HTML from /public
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

/* database */
const raws = {}; // raws[id] = { code }

/* create raw */
app.post("/api/create", (req, res) => {
    const { code } = req.body;

    if (!code) return res.json({ error: "No code provided" });

    const id = crypto.randomBytes(8).toString("hex");
    raws[id] = { code };

    const fullUrl = `${req.protocol}://${req.get("host")}/raw/${id}`;

    res.json({ url: fullUrl });
});

/* access raw */
app.get("/raw/:id", (req, res) => {
    const id = req.params.id;

    if (!raws[id]) return res.status(404).send("Invalid RAW ID.");

    const ua = req.headers["user-agent"] || "";

    const isRoblox =
        ua.includes("Roblox") ||
        ua.includes("HttpService") ||
        ua.includes("Game") ||
        ua === "";

    if (isRoblox) {
        res.setHeader("Content-Type", "text/plain");
        return res.send(raws[id].code);
    }

    res.setHeader("Content-Type", "text/plain");
    res.send("ANO SKID PA?");
});

/* start server */
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
