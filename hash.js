import crypto from "crypto-js";
import { password } from "./src/routes/passwordRouter.js";
const { AES, enc } = crypto

export const encrypt = (text) => {
    // console.log(password)
    const encryptedText = AES.encrypt(text, password).toString();
    return encryptedText;
};

export const decrypt = (encryptedText) => {
    const decryptedText = AES.decrypt(encryptedText, password).toString(enc.Utf8);
    return decryptedText;
};

