// controllers/contactSubmissionController.js
import { pool } from "../db.js";

// Add new contact submission (your existing function)
export const addContactSubmission = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const result = await pool.query(
      `INSERT INTO contact_submissions (name, email, phone, subject, message, submission_date)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [name, email, phone, subject, message]
    );

    res.status(201).json({ message: "Message sent successfully!", submission: result.rows[0] });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ message: "Server error while saving your message" });
  }
};

// Get all contact submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, subject, message, submission_date
       FROM contact_submissions
       ORDER BY submission_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single submission by ID
export const getSubmissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, subject, message, submission_date
       FROM contact_submissions
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a submission by ID
export const updateSubmission = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subject, message } = req.body;

  try {
    const result = await pool.query(
      `UPDATE contact_submissions
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           subject = COALESCE($4, subject),
           message = COALESCE($5, message)
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, subject, message, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({ message: "Submission updated successfully", submission: result.rows[0] });
  } catch (err) {
    console.error("Error updating submission:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a submission by ID
export const deleteSubmission = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM contact_submissions
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({ message: "Submission deleted successfully", submission: result.rows[0] });
  } catch (err) {
    console.error("Error deleting submission:", err);
    res.status(500).json({ message: "Server error" });
  }
};
