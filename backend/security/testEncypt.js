// test-encryption.js

const { encrypt, decrypt } = require('./encryption');

// Test data
const testData = "Hello, this is a test message!";
const secretKey = "your-very-secure-secret-key";

// Encrypt the test data
const encryptedData = encrypt(testData, secretKey);
console.log("Encrypted Data:", encryptedData);

// Decrypt the encrypted data
const decryptedData = decrypt(encryptedData, secretKey);
console.log("Decrypted Data:", decryptedData);

// Check if decrypted data matches the original data
if (decryptedData === testData) {
    console.log("Success! Decrypted data matches the original data.");
} else {
    console.log("Error! Decrypted data does not match the original data.");
}
