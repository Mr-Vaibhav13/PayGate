const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(express.static('public'));
app.use(cors());


app.get('/api/upi-qr', (req, res) => {
    const { amount, vpa } = req.query;

    // edit this change merchant name i.e pn
    const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=Example%20Merchant&tr=${Date.now()}&tn=Payment%20for%20Order&am=${encodeURIComponent(amount)}&cu=INR`;

    

    QRCode.toDataURL(upiLink, (err, url) => {
        if (err) {
            res.status(500).send('Error generating QR code');
            return;
        }
        res.json({ qrCodeUrl: url, upiLink:upiLink });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3001');
  });
