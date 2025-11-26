const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const dataDir = "files";
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

/* ---- CREATE ---- */
app.post("/api/create", (req, res) => {
    const code = req.body.code;
    const id = Date.now().toString() + ".txt";
    fs.writeFileSync(path.join(dataDir, id), code);
    res.json({ url: `/raw/${id}` });
});

/* ---- SERVE RAW ---- */
app.get("/raw/:file", (req, res) => {
    const file = req.params.file;
    const p = path.join(dataDir, file);
    if (!fs.existsSync(p)) return res.status(403).send("Access denied.");
    res.sendFile(path.resolve(p));
});

/* ---- LIST ---- */
app.get("/api/list", (req, res) => {
    res.json(fs.readdirSync(dataDir));
});

/* ---- EDIT ---- */
app.post("/api/edit", (req, res) => {
    const { name, code } = req.body;
    fs.writeFileSync(path.join(dataDir, name), code);
    res.json({ success: true });
});

/* ---- DELETE ---- */
app.post("/api/delete", (req, res) => {
    const { name } = req.body;
    fs.unlinkSync(path.join(dataDir, name));
    res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));
