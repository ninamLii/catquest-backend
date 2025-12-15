import express from "express";
import dotenv from "dotenv";
dotenv.config();
import catsRouter from "./routes/cats.routes.js";
import catQuestRouter from "./routes/cat-quest.routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint to verify server is running
app.get("/api/health", (_, res) => {
  res.json({ status: "ok dude" });
});

app.use("/cats", catsRouter);
app.use("/cat-quest", catQuestRouter);

const port = Number(process.env.PORT ?? 3000);

// Start the server and listen on configured port (default 3000)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
