import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const checkQuery = "SELECT * FROM users WHERE email = $1";
    const existingUser = await pool.query(checkQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
            INSERT INTO users (username, email, password_hash, full_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, full_name
        `;

    const newUser = await pool.query(insertQuery, [
      username,
      email,
      hashedPassword,
      fullName,
    ]);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const userQuery = `
            SELECT * FROM users
            WHERE email = $1 OR username = $1
            LIMIT 1
        `;
    const result = await pool.query(userQuery, [emailOrUsername]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid dredentials" });

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, username, email, full_name, phone_number, date_of_birth
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phoneNumber, dateOfBirth } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           phone_number = COALESCE($2, phone_number),
           date_of_birth = COALESCE($3, date_of_birth),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, username, email, full_name, phone_number, date_of_birth, updated_at`,
      [fullName, phoneNumber, dateOfBirth, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users
       SET deleted_at = NOW()
       WHERE id = $1
       RETURNING id, username, email, deleted_at`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
