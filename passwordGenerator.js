import { randomBytes } from "crypto";

function PasswordGenerator() {
  const password = generatePassword();
  const lastUpdated = Date.now();

  function generatePassword() {
    return randomBytes(8).toString("hex");
  }

  function getPassword() {
    // Check if the password has expired
    if (Date.now() - lastUpdated > 36 * 60 * 60 * 1000) {
      // Generate a new password
      password = generatePassword();
      lastUpdated = Date.now();
    }

    return password;
  }

  return {
    getPassword,
  };
}

export default PasswordGenerator;


