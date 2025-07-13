import express from "express";
import path from "node:path";
import fs from "node:fs/promises";

const savePath = path.join(import.meta.dirname, "save.json");

const app = express();
const PORT = 8080;

const saveData = async (data: any) => {
  await fs.writeFile(savePath, JSON.stringify(data, null, 2));
};

const getSaveData = async () => {
  if (
    await fs
      .access(savePath)
      .then(() => true)
      .catch(() => false)
  ) {
    const data = await fs.readFile(savePath, "utf-8");
    return data;
  }
  return "null";
};

app.get("/save", async (req, res) => {
  const data = await getSaveData();
  res.send(data);
});

app.get("/save.jsonp.js", async (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  const progressData = await getSaveData();
  if (progressData === "null") {
    res.send("");
    return;
  }
  res.send(
    `localStorage.setItem('progress', ${JSON.stringify(progressData)});`
  );
});

app.post("/save", express.json(), async (req, res) => {
  const data = req.body;
  await saveData(data);
  res.json({
    success: true,
  });
});

app.use(express.static(path.join(import.meta.dirname)));

app.listen(PORT, () => {
  console.log(`CSS Diner server running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop`);
});
