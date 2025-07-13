import express from "express";
import dotenv from "dotenv";
import rootRouter from "./router";
import cors from "cors";

// Load environment variables
dotenv.config({ path: ".env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rootRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
