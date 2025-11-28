import express from "express";

const app = express();

// Health check endpoint to verify server is running
app.get("/api/health", (_, res) => {
  res.json({ status: "ok dude" });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
