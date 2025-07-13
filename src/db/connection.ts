import knex, { Knex } from "knex";
import logger from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();

let db: Knex;
try {
  db = knex({
    debug: true,
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  });
  logger.info("DB connected");
} catch (e) {
  logger.error("e-connect-knex", e);
  throw e;
}

export default db;
