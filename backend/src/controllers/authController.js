import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existingName = await User.findOne({ where: { name } });
    if (existingName)
      return res.status(400).json({ msg: "Username already taken" });

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password_hash: hashed });

    return res.json({ msg: "User registered successfully!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Login (by username)
export const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password)
      return res
        .status(400)
        .json({ msg: "Please enter username and password" });

    const user = await User.findOne({ where: { name } });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
