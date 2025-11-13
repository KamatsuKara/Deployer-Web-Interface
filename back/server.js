import express from "express";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CONFIG_PATH = "/home/baptiste/Projects-Manager/projects.json";
const LOG_DIR = "/home/baptiste/Projects-Manager/logs";
const UPDATE_COMMAND = "python3 projects_manager.py";
const COMMAND_DIR = "/home/baptiste/Projects-Manager/";

// Lire le JSON
app.get("/config", (req, res) => {
  try {
    const data = fs.readFileSync(CONFIG_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).send("Error reading JSON");
  }
});

// Écrire le JSON
app.post("/config", (req, res) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(req.body, null, 2));
    res.send("Config updated!");
  } catch (e) {
    res.status(500).send("Error writing JSON");
  }
});

// Exécuter la commande de mise à jour
app.post("/update", (req, res) => {
  exec(UPDATE_COMMAND, { cwd: COMMAND_DIR }, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout || "Command executed successfully!");
  });
});

// Lister les logs
app.get("/logs", (req, res) => {
  fs.readdir(LOG_DIR, (err, files) => {
    if (err) return res.status(500).send("Unable to read logs directory");
    res.json(files);
  });
});

// Lire un log
app.get("/logs/:filename", (req, res) => {
  const filePath = path.join(LOG_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
  res.sendFile(path.resolve(filePath));
});

const args = process.argv.slice(2);
const PORT = args[0] || 3001;
app.listen(PORT, () => console.log(`Backend Running on port ${PORT}`));
