
import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error("Database environment variables missing");
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

export {sequelize}

