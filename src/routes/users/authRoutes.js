import express from "express";
import { login } from "../../controllers/auth/login.js"
const router = express.Router();
//Login Process
router.post("/loginUser", login)
// router.post("/api/users/auth/login", login)

// Register Process
export default router;
