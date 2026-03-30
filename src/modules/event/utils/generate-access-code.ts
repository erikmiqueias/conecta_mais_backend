import crypto from "node:crypto";

export function generateAccessCode(length: number = 5): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, alphabet.length);
    code += alphabet[randomIndex];
  }

  return code;
}
