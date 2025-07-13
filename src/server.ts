import express from "express";
import dotenv from "dotenv";
import rootRouter from "./router";
import cors from "cors";
import { sequelize } from "./db/connection";
import logger from "./utils/logger";

// Load environment variables
dotenv.config({ path: ".env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rootRouter);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info("DB synced");
    app.listen(PORT, () => {
      logger.info(`Server listening at port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to sync DB:", err);
  }
})();
