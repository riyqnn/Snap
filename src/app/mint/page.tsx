"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Camera, X, Upload } from "lucide-react";
import jsQR from 'jsqr';

const ClaimCodePage: React.FC = () => {
  const router = useRouter();
  const [claimCode, setClaimCode] = useState("");
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!claimCode.trim()) {
      setError("Please enter a claim code");
      return;
    }

    setError("");
    router.push(`/mint/${claimCode.trim()}`);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          // Mulai scanning loop
          const scanLoop = () => {
            scanFromVideo();
            animationFrameRef.current = requestAnimationFrame(scanLoop);
          };
          scanLoop();
        };
      }
    } catch (err) {
      setError("Camera access denied. Please try uploading an image instead.");
      console.error("Camera error:", err);
    }
  };


  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanFromVideo = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log('tirr')
    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        setClaimCode(code.data);
        setError("");
        closeScanner();
        return;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Use jsQR to decode
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              setClaimCode(code.data);
              setError("");
              closeScanner();
            } else {
              setError("No QR code found in image. Please try another image.");
            }
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openScanner = (mode: 'camera' | 'upload') => {
    setScanMode(mode);
    setShowScanner(true);
    if (mode === 'camera') {
      startCamera();
    }
  };

  const closeScanner = () => {
    stopCamera();
    setShowScanner(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden pt-30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/output-background.png"
            alt="city background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <button
                onClick={closeScanner}
                className="absolute -top-12 right-0 z-10 bg-white rounded-full p-3 hover:bg-gray-100 transition-all shadow-lg"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Scan QR Code
                </h3>

                {/* Mode Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      if (scanMode !== 'camera') {
                        setScanMode('camera');
                        startCamera();
                      }
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      scanMode === 'camera'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Camera
                  </button>
                  <button
                    onClick={() => {
                      if (scanMode !== 'upload') {
                        stopCamera();
                        setScanMode('upload');
                      }
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      scanMode === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload
                  </button>
                </div>
                
                {scanMode === 'camera' ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-square">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Scanning Frame Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-4 border-blue-500 rounded-2xl relative">
                        {/* Corner indicators */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                        
                        {/* Scanning line animation */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="w-full h-1 bg-blue-400 shadow-lg shadow-blue-400/50 animate-scan" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 aspect-square flex items-center justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="qr-upload"
                    />
                    <label
                      htmlFor="qr-upload"
                      className="cursor-pointer text-center p-8"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-2">
                        Click to upload QR code image
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, or JPEG
                      </p>
                    </label>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 text-center mt-4">
                  {scanMode === 'camera' 
                    ? 'Position the QR code within the frame'
                    : 'Upload an image containing a QR code'}
                </p>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Header Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              HI THERE
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold">
              REDEEM YOUR <span className="text-blue-600">SNAP</span>
            </h2>
          </div>

          {/* Claim Card */}
          <div className="w-full max-w-md bg-white rounded-3xl border-2 border-blue-600 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
              Claim this SNAP
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your claim code, scan QR, or upload QR image to collect this digital certificate.
            </p>

            {/* Claim Code Input Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="claimCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Claim Code
                </label>
                <div className="relative">
                  <input
                    id="claimCode"
                    type="text"
                    value={claimCode}
                    onChange={(e) => {
                      setClaimCode(e.target.value);
                      setError("");
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter code or scan QR"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => openScanner('camera')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Scan QR Code"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>

              {/* Scan Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => openScanner('camera')}
                  className="py-3 px-4 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Scan QR
                </button>
                <button
                  type="button"
                  onClick={() => openScanner('upload')}
                  className="py-3 px-4 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload QR
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!claimCode.trim()}
              >
                Redeem Now
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By redeeming this SNAP, you accept SNAPs{" "}
              <span className="text-blue-600 underline cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Mint for free on <span className="font-bold text-blue-600">Base</span>
              </p>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-600 mt-6 text-center max-w-md">
            Don&apos;t have a claim code?
            <span className="text-blue-600 font-semibold underline cursor-pointer">
              Contact the brand
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(256px);
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ClaimCodePage;