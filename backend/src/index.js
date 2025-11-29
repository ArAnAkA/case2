import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Получаем __dirname (в ES-модулях)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Пример API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Привет с backend!" });
});

// Путь к фронтенду
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// Все маршруты — на React
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
