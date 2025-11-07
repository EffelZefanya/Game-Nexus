// routes/contactSubmission.js
import express from "express";
import {
  addContactSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission
} from "../controllers/contactSubmissionController.js";

const router = express.Router();
router.post("/", addContactSubmission);
router.get("/", getAllSubmissions);
router.get("/:id", getSubmissionById);
router.put("/:id", updateSubmission);
router.delete("/:id", deleteSubmission);

export default router;
