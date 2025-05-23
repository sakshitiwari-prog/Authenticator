const express = require('express');
const {
    generateQr,
    scanQr,
    checkQrStatus,
  } = require('../controllers/qrController');
const { requestOtp, verifyOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/generate-qr', generateQr);
router.post('/scan-qr', scanQr);
router.get('/check-qr-status', checkQrStatus);
module.exports = router;
