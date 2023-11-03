import express from "express";
const router = express.Router();
import { firebaseConfig } from "../database-connection/database.js";

router.get("/firebase",(req,res) => {
    res.status(200).json({
        firebaseConfig
      })
});

export default router;