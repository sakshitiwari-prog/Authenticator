const jwt = require('jsonwebtoken');
const OTP = require('../models/otpModel');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET 

const otpGenerator = require('otp-generator');
const sendEmail = require('../config/mailer');

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    const existingOtp = await OTP.findOne({ email });
    if (existingOtp) await OTP.deleteOne({ _id: existingOtp._id });


    const newOtp = new OTP({ email, otp });
    await newOtp.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
    res.status(200).send({success: true, message: 'OTP sent successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, message: 'Error sending OTP'});
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp, 'email and otp');

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).send({ success: false, message: 'Invalid OTP' });
    }
console.log(otpRecord, 'otpRecord');
    await otpRecord.deleteOne();

    // Generate JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: false, 
        sameSite: 'none',
        maxAge: 3600000, 
      })
      .status(200)
      .send({ success: true, message: 'OTP verified successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error verifying OTP' });
  }
};

