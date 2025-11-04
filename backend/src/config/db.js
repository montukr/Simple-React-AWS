import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      // If your RDS enforces TLS, keep this; otherwise you can remove.
      ssl: { require: true, rejectUnauthorized: false },
    },
  }
);

export default sequelize;
