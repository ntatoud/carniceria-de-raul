import * as crypto from 'crypto';
const generate32ByteSalt = () => {
    const saltBytes = crypto.randomBytes(32); // 32 bytes for the salt
    return saltBytes.toString('hex'); // Convert the buffer to a hexadecimal string
};
const xorStringWith32ByteKey = (inputString, key32Bytes) => {
    var _a, _b;
    const inputBuffer = Buffer.from(inputString, 'utf-8');
    const keyBuffer = Buffer.from(key32Bytes, 'hex');
    // XOR the input buffer with the key buffer
    const xorResult = Buffer.alloc(inputBuffer.length);
    for (let i = 0; i < inputBuffer.length; i++) {
        xorResult[i] =
            ((_a = inputBuffer[i]) !== null && _a !== void 0 ? _a : 0) ^ ((_b = keyBuffer[i % keyBuffer.length]) !== null && _b !== void 0 ? _b : 0);
    }
    // Convert the result to a hexadecimal string
    return xorResult.toString('hex');
};
const sha256HexString = (inputHex) => {
    const inputBuffer = Buffer.from(inputHex, 'hex');
    const hashBuffer = crypto.createHash('sha256').update(inputBuffer).digest();
    return hashBuffer.toString('hex');
};
export const generateSaltHashedPassword = (password) => {
    const salt = generate32ByteSalt();
    const saltedPwd = xorStringWith32ByteKey(password, salt);
    const hashPwd = sha256HexString(saltedPwd);
    return { salt, hashPwd };
};
export const isPasswordCorrect = (enteredPassword, user) => {
    const saltedPwd = xorStringWith32ByteKey(enteredPassword, user.salt);
    const hashPwd = sha256HexString(saltedPwd);
    return hashPwd === user.password;
};
