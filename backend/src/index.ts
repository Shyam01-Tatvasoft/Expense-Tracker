import express from "express";
import cors from "cors";
import categories from "./routes/categories.js";
import expenses from "./routes/expenses.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categories", categories);
app.use("/api/expenses", expenses);

const port = Number(process.env.PORT) || 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on port ${port}`);
});