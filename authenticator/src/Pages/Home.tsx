import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { post } from '../utils/serviceHelper';

const Home = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const sendScanToBackend = async (token: string, email: string) => {
    try {
      console.log('inside sendScanToBackend');
      const data = await post('/auth/scan-qr', { token, email });
      console.log(data, 'data---------------');

      if (data.success) {
        console.log('Scan confirmed by backend');
      } else {
        console.error('Backend rejected scan:', data.message);
      }
    } catch (err: any) {
      console.error("Failed to decode QR from image:", err?.message || err);
      alert(`QR code not detected. Error: ${err?.message || 'Unknown error'}`);
    }
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const qrCodeScanner = new Html5Qrcode("qr-reader");

    try {
      const decodedText = await qrCodeScanner.scanFile(file, true);

      console.log("Decoded from image:", decodedText);
      setScanResult(decodedText);

      const email = localStorage.getItem('userEmail') || '';
      if (email) {
        await sendScanToBackend(decodedText, email);
      }

    } catch (err) {
      console.error("Failed to decode QR from image:", err);
    }
  };

  const handleLogout = () => {
    document.cookie = 'authToken=; Max-Age=0';
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const startScanning = () => {
    if (!qrScannerRef.current) {
      qrScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      );

      qrScannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);

          const email = localStorage.getItem('userEmail') || '';

          if (email) {
            sendScanToBackend(decodedText, email);
          } else {
            console.warn('User email not found, cannot send scan to backend');
          }

          stopScanning();
        },
        (errorMessage) => {
          console.warn('QR scan error:', errorMessage);
        }
      );
    }
  };

  const stopScanning = () => {
    qrScannerRef.current?.clear().then(() => {
      qrScannerRef.current = null;
      setIsScanning(false);
    });
  };

  useEffect(() => {
    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isScanning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
      >
        Logout
      </button>

      <div className="mt-8">
        <button
          onClick={() => setIsScanning((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>
      </div>

      {isScanning && <div id="qr-reader" className="mt-8 w-full max-w-xs" ref={scannerRef}></div>}

      {scanResult && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Or scan a QR code from an image:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 text-sm"
          />
        </div>

      )}
    </div>
  );
};

export default Home;
