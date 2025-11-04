// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging: false
//   }
// );

// export default sequelize;

import { Sequelize } from "sequelize";

// TEMP: hardcoded local credentials for debugging
const DB_NAME = "users";
const DB_USER = "root";
const DB_PASS = "1234";
const DB_HOST = "127.0.0.1";
const DB_PORT = 3306;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: console.log, // enable SQL logs during debug
});

export default sequelize;
