const API_URL = "http://localhost:3001/api";

// === GESTION DU JSON ===
async function loadConfig() {
  const res = await fetch(`${API_URL}/config`);
  const data = await res.json();
  document.getElementById("json-editor").value = JSON.stringify(data, null, 2);
}

document.getElementById("save-json").onclick = async () => {
  const content = document.getElementById("json-editor").value;
  await fetch(`${API_URL}/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: content,
  });
  alert("Config saved");
};

// === EXECUTION DE COMMANDE ===
document.getElementById("run-update").onclick = async () => {
  const res = await fetch(`${API_URL}/update`, { method: "POST" });
  const text = await res.text();
  document.getElementById("update-output").textContent = text;
};

// === LECTURE DES LOGS ===
async function loadLogs() {
  const res = await fetch(`${API_URL}/logs`);
  const logs = await res.json();
  const list = document.getElementById("log-list");
  list.innerHTML = "";
  logs.forEach((file) => {
    const li = document.createElement("li");
    li.textContent = file;
    li.onclick = async () => {
      const logRes = await fetch(`${API_URL}/logs/${file}`);
      const content = await logRes.text();
      document.getElementById("log-content").textContent = content;
    };
    list.appendChild(li);
  });
}

loadConfig();
loadLogs();
