import express from "express";
import dotenv from "dotenv";
dotenv.config();
import catsRouter from "./routes/cats.routes.js";
import catQuestRouter from "./routes/cat-quest.routes.js";

const app = express();
app.use(express.json());

// Health check endpoint to verify server is running
app.get("/api/health", (_, res) => {
  res.json({ status: "ok dude" });
});

app.use("/cats", catsRouter);
app.use("/cat-quest", catQuestRouter);

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
