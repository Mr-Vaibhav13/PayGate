
// const crypto = require('crypto');
// const secret = crypto.randomBytes(32).toString('hex');
// console.log(secret);

const crypto = require('crypto');
const WEBHOOK_SECRET = '30308196d0ca83862712c2f9380548812c842e055e3d421e4272e9dd5a3f40a1'; // Replace with your actual secret
const payload = JSON.stringify({ transactionId: "1724318861588", status: "completed" });

const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

console.log(signature); // Print this signature and use it in Postman