// encryption.js
// const crypto = require('crypto');
// const algorithm = 'aes-256-cbc';
// const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
// const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
require('dotenv').config();

// const encrypt = (text) => {
//   if (typeof text !== 'string') {
//     text = text.toString();
//   }
//   let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
// };

// const decrypt = (text) => {
//     if (typeof text !== 'string') {
//       console.error('Received non-string input for decryption:', text);
//       throw new Error('Invalid input: text should be a string');
//     }
    
//     const parts = text.split(':');
//     if (parts.length !== 2) {
//       throw new Error('Invalid input format');
//     }
    
//     const [ivHex, encryptedTextHex] = parts;
    
//     if (!ivHex || !encryptedTextHex) {
//       throw new Error('Invalid input: IV or encrypted text is missing');
//     }
    
//     let iv, encryptedText;
//     try {
//       iv = Buffer.from(ivHex, 'hex');
//       encryptedText = Buffer.from(encryptedTextHex, 'hex');
//     } catch (error) {
//       throw new Error('Failed to create buffers from hexadecimal strings');
//     }
    
//     if (iv.length !== 16 || key.length !== 32) {
//       throw new Error('Invalid key or IV length');
//     }
    
//     let decipher;
//     try {
//       decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
//     } catch (error) {
//       throw new Error('Failed to create decipher');
//     }
    
//     let decrypted;
//     try {
//       decrypted = decipher.update(encryptedText);
//       decrypted = Buffer.concat([decrypted, decipher.final()]);
//     } catch (error) {
//       throw new Error('Decryption failed');
//     }
    
//     return decrypted.toString();
//   };
  
//   const encryptedValue = '89fe4f8fd4ac53d58506a84e7d80830f:3c444b401d9cd2812d629e26da81e339';
// const decryptedValue = decrypt(encryptedValue);
// console.log('Decrypted Value:', decryptedValue);

console.log('Encryption Key:', process.env.ENCRYPTION_KEY);
console.log('Encryption IV:', process.env.ENCRYPTION_IV);
