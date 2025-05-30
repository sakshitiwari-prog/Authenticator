import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormValues } from '../utils/type';
import { emailInitialValues } from '../utils/initialValues';
import { emailValidationSchema } from '../utils/schema';
import { post, get } from '../utils/serviceHelper';
import QRCode from 'react-qr-code';
const SignIn = () => {
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            setSuccessMessage(null);
            setApiError(null);
            setSubmitting(true);
            localStorage.setItem('userEmail', values.email);
            const response = await post('/auth/request-otp', values);
            if (response.success) {
                setSuccessMessage(response?.message ?? 'OTP sent successfully.');
                navigate('/verify-otp', { state: { email: values.email } });
            }
        } catch (error: any) {
            console.error(error);
            setApiError(
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenerateQr = async () => {
        try {
            setApiError(null);
            const response = await get('/auth/generate-qr');
            if (response?.token) {
                setQrToken(response.token);
                try {
                    const interval = setInterval(async () => {
                        const result = await get(`/auth/check-qr-status?token=${response.token}`);
                        if (result.success && result.token) {
                            clearInterval(interval);
                            localStorage.setItem('token', result.token);
                            navigate('/');
                        }
                    }, 3000);
                    setPolling(interval);
                } catch (error) {
                    console.error('Error checking QR status:', error);
                    setApiError('Failed to check QR code status.');
                }
            }
        } catch (error: any) {
            console.error('Error details:', error);
            if (error.response?.status === 404) {
                setApiError('QR code generation endpoint not found (404). Check backend route.');
            } else if (error.response) {
                setApiError(`API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else {
                setApiError('Failed to connect to the server.');
            }
        }

    };

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-50">
            
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl flex flex-col md:flex-row gap-6">
  {/* Email Form (left side) */}
  <div className="bg-white px-6 py-8 shadow rounded-lg space-y-6 w-full md:w-1/2">
    <Formik
      initialValues={emailInitialValues}
      validationSchema={emailValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    Email OTP Login
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email to receive a login code or use QR code login.
                </p>
            </div>

          {!qrToken && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                  Email address
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                  placeholder="you@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              {apiError && (
                <div className="text-sm text-red-600 mt-2 text-center">{apiError}</div>
              )}

              {successMessage && (
                <div className="text-sm text-green-600 mt-2 text-center">{successMessage}</div>
              )}
            </>
          )}

          <div className="space-y-3">
            {!qrToken && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
            )}

            {!qrToken && <div className="text-center text-sm text-gray-500">OR</div>}

            <button
              type="button"
              onClick={handleGenerateQr}
              className="w-full cursor-pointer flex justify-center rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {qrToken ? 'Regenerate QR Code' : 'Login with QR Code'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>

  {/* QR Code Section (right side) */}
{qrToken && (
    <div className="flex justify-center items-center w-full md:w-1/2 bg-white px-6 py-8 ml-30 mb-16 shadow rounded-lg">
      <div style={{ height: "auto", margin: "0 auto", width: "100%" }}>
        <QRCode
          size={300}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={qrToken}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  )}
</div>

        </div>
    );
};

export default SignIn;
