import { signInWithEmailAndPassword } from "firebase/auth";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../database-connection/database.js";
import { encrypt } from "../../../hash.js";

// Initialize the Admin SDK

import { authAdmin } from "../../database-connection/database.js";
export const login = expressAsyncHandler(async (req, res, next) => {
  const { password, email } = req.body
  const user = await signInWithEmailAndPassword(auth, email, password)
  const token = await authAdmin.createCustomToken(user.user.uid);

  try {
    const idToken = user._tokenResponse.idToken
    // const refreshToken = encrypt(user._tokenResponse.refreshToken)
    const uid = user.user.uid
    const displayName = user.user.displayName
    res.send({
      idToken: idToken,
      // refreshToken: refreshToken,
      uid: uid,
      displayName, displayName
    })
  } catch (error) {
    console.log(error)
  }

})


