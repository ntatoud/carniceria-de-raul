import * as crypto from "crypto";
import { User } from "../types";

const generate32ByteSalt = (): string => {
  const saltBytes = crypto.randomBytes(32); // 32 bytes for the salt
  return saltBytes.toString("hex"); // Convert the buffer to a hexadecimal string
};

const xorStringWith32ByteKey = (
  inputString: string,
  key32Bytes: string
): string => {
  const inputBuffer = Buffer.from(inputString, "utf-8");
  const keyBuffer = Buffer.from(key32Bytes, "hex");

  // XOR the input buffer with the key buffer
  const xorResult = Buffer.alloc(inputBuffer.length);
  for (let i = 0; i < inputBuffer.length; i++) {
    xorResult[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  // Convert the result to a hexadecimal string
  return xorResult.toString("hex");
};
const sha256HexString = (inputHex: string): string => {
  const inputBuffer = Buffer.from(inputHex, "hex");
  const hashBuffer = crypto.createHash("sha256").update(inputBuffer).digest();
  return hashBuffer.toString("hex");
};

export const generateSaltHashedPassword = (
  password: string
): { salt: string; hashPwd: string } => {
  const salt = generate32ByteSalt();
  const saltedPwd = xorStringWith32ByteKey(password, salt);
  const hashPwd = sha256HexString(saltedPwd);

  return { salt, hashPwd };
};

export const isPasswordCorrect = (
  enteredPassword: string,
  user: User
): boolean => {
  const saltedPwd = xorStringWith32ByteKey(enteredPassword, user.salt);
  const hashPwd = sha256HexString(saltedPwd);

  return hashPwd === user.password;
};
