import express from "express";
const router = express.Router();
import PasswordGenerator from "../../passwordGenerator.js";

const generator = new PasswordGenerator();

// export const password = generator.getPassword();
export const password = "password";

// const password = "password"

router.get("/getCryptoPassword",(req,res) => {
    res.status(200).json({
        password
      })
});

export default router;