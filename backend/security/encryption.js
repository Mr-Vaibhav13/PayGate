// encryption.js
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

const encrypt = (text) => {
  if (typeof text !== 'string') {
    text = text.toString();
  }
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// const decrypt = (text) => {
//   let [ivHex, encryptedTextHex] = text.split(':');
//   let iv = Buffer.from(ivHex, 'hex');
//   let encryptedText = Buffer.from(encryptedTextHex, 'hex');
//   let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// };

const decrypt = (text) => {
  if (typeof text !== 'string') {
    console.error('Received non-string input for decryption:', text);
    throw new Error('Invalid input: text should be a string');
  }
  
  const parts = text.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid input format');
  }
  
  let [ivHex, encryptedTextHex] = parts;
  let iv = Buffer.from(ivHex, 'hex');
  let encryptedText = Buffer.from(encryptedTextHex, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };
