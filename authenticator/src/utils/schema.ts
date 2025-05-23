import * as Yup from 'yup';
 
  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });
  const qrValidationSchema = Yup.object({
    otp: Yup.string()
      .length(6, 'OTP must be 6 digits')
      .required('OTP is required'),
  });
export { emailValidationSchema,qrValidationSchema };