const QRToken = require('../models/qrTokenModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.generateQr = async (req, res) => {
  const token = crypto.randomBytes(20).toString('hex');

  await QRToken.create({ token });

  res.status(200).send({sucess:true, token }); 
};

exports.scanQr = async (req, res) => {
    const { token, email } = req.body;
  
    const qrToken = await QRToken.findOne({ token });
  console.log(qrToken,token, email,'qrToken');
  
    if (!qrToken) return res.status(404).send({ success: false, message: 'Invalid token' });
  
    qrToken.scanned = true;
    qrToken.email = email;
    await qrToken.save();
  
    res.status(200).send({ success: true });
  };

  exports.checkQrStatus = async (req, res) => {
    const { token } = req.query;
  
    const qrToken = await QRToken.findOne({ token });
  
    if (!qrToken) return res.status(404).send({ success: false, message: 'Token expired or not found' });
  
    if (qrToken.scanned) {
      const jwtToken = jwt.sign({ email: qrToken.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      await qrToken.deleteOne(); 
      return res.cookie('authToken', jwtToken, {
        httpOnly: true,
        secure: false, 
        sameSite: 'none',
        maxAge: 3600000, 
      }).status(200).send({ success: true, token: jwtToken });
    }
  
    res.status(200).send({ success: false, scanned: false });
  };