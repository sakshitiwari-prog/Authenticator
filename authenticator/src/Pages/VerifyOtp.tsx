import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { post } from '../utils/serviceHelper';
import { useState } from 'react';
import { qrValidationSchema } from '../utils/schema';
import { qrInitialValues } from '../utils/initialValues';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [resendMessage, setResendMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (
    values: { otp: string },
    { setSubmitting, setFieldError }: FormikHelpers<{ otp: string }>
  ) => {
    try {
      const response = await post('/auth/verify-otp', {
        email,
        otp: values.otp,
      });

      if (response.success) {
        localStorage.setItem('token', response?.token);

        navigate('/');
      } else {
        setFieldError('otp', response.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setFieldError('otp', 'Failed to verify OTP. Try again.');
    } finally {
      setTimeout(() => {
        setFieldError('otp', '');
      }, 5000);
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage('');

    try {
      const response = await post('/auth/request-otp', { email });

      if (response.success) {
        setResendMessage(response?.message ?? 'OTP sent successfully to your email.');
      } else {
        setResendMessage('Failed to resend OTP.');
      }
    } catch (error) {
      setResendMessage('Something went wrong.');
    } finally {
      setTimeout(() => {
        setResendMessage('');
      }, 5000);
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-center text-2xl font-bold text-gray-900">Enter OTP</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <Formik
          initialValues={qrInitialValues}
          validationSchema={qrValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-6 space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP Code
                </label>
                <Field
                  type="text"
                  name="otp"
                  id="otp"
                  maxLength={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-lg tracking-widest text-center focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="123456"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-sm text-indigo-600 hover:underline"
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
          {resendMessage && (
            <p className="mt-2 text-sm text-green-600">{resendMessage}</p>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-500 hover:underline"
          >
            Wrong email? Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
