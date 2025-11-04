import sequelize from "../config/db.js";
import User from "./User.js";

export const initDb = async () => {
  await sequelize.authenticate();
  // For first deploy in lab/demo, use sync to auto-create table:
  await sequelize.sync({ alter: true });
  console.log("✅ MySQL connected & models synchronized");
};

export { sequelize, User };
