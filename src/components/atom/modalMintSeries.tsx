'use client'
import { useState, FormEvent, useRef } from 'react';
import Image from 'next/image';
import { useProductSeriesNFT } from '@/hooks/useProductSeriesNFT';

interface MintSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MintSeriesModal({
  isOpen,
  onClose,
}: MintSeriesModalProps) {
  const [formData, setFormData] = useState({
    seriesName: '',
    description: '',
    maxSupply: ''
  });
  const { mintSeries } = useProductSeriesNFT();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>('');
  const [uploadedURI, setUploadedURI] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToPinata = async (file: File): Promise<string> => {
    const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!PINATA_JWT) throw new Error("Missing Pinata JWT token!");

    setIsUploading(true);
    setStatusMessage('📤 Uploading image to IPFS...');

    try {
      const formData = new FormData();
      formData.append("file", file);

      const metadata = JSON.stringify({
        name: `series-image-${Date.now()}`,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 1,  
      });
      formData.append("pinataOptions", options);

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload to Pinata");

      setStatusMessage('✅ Image uploaded successfully!');
      // URL Gateway publik IPFS
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (err) {
      setStatusMessage('');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setStatusMessage('');

    // Validation
    if (!formData.seriesName || !formData.description || !formData.maxSupply) {
      setError('All fields are required');
      return;
    }

    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    const maxSupply = parseInt(formData.maxSupply);
    if (isNaN(maxSupply) || maxSupply <= 0) {
      setError('Max supply must be a positive number');
      return;
    }

    try {
      // Upload image first if not already uploaded
      let imageURI = uploadedURI;
      if (!imageURI) {
        imageURI = await uploadToPinata(selectedFile);
        setUploadedURI(imageURI);
      }

      // Then mint the series
      setIsMinting(true);
      setStatusMessage('⛏️ Minting series NFT...');
      setError(null);

      const result = await mintSeries(
        formData.seriesName,
        imageURI,
        formData.description,
        maxSupply
      );

      if (result.success) {
        setStatusMessage('🎉 Series minted successfully!');
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2500);
      } else {
        setStatusMessage('');
        setError(result.error || 'Failed to mint series');
      }
    } catch (err) {
      setStatusMessage('');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsMinting(false);
    }
  };

  const handleClose = () => {
    if (isUploading || isMinting) {
      // Prevent closing during processing
      return;
    }
    
    setFormData({
      seriesName: '',
      description: '',
      maxSupply: ''
    });
    setSelectedFile(null);
    setPreviewURL('');
    setUploadedURI('');
    setError(null);
    setSuccess(false);
    setStatusMessage('');
    onClose();
  };

  if (!isOpen) return null;

  const isProcessing = isUploading || isMinting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative">
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mint New Series</h2>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isProcessing ? "Please wait for process to complete" : "Close"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && !error && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                {isProcessing && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
                <p className="text-sm text-blue-800 font-medium">{statusMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="font-medium">❌ Error</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {/* Success Message - Full Screen Overlay */}
          {success && (
            <div className="fixed inset-0 bg-white rounded-2xl flex items-center justify-center z-50">
              <div className="text-center p-8">
                <div className="mb-6 animate-bounce">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Success! 🎉
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  Series minted successfully!
                </p>
                <p className="text-sm text-gray-500">
                  Closing in a moment...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="seriesName" className="block text-sm font-medium text-gray-700 mb-1">
                Series Name
              </label>
              <input
                type="text"
                id="seriesName"
                value={formData.seriesName}
                onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d9cfb] focus:border-transparent outline-none transition-all"
                placeholder="Enter series name"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series Image
              </label>
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#3d9cfb] transition-colors ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {previewURL ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={previewURL}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                    {!isProcessing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewURL('');
                          setUploadedURI('');
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d9cfb] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Enter series description"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label htmlFor="maxSupply" className="block text-sm font-medium text-gray-700 mb-1">
                Max Supply
              </label>
              <input
                type="number"
                id="maxSupply"
                value={formData.maxSupply}
                onChange={(e) => setFormData({ ...formData, maxSupply: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d9cfb] focus:border-transparent outline-none transition-all"
                placeholder="Enter maximum supply"
                min="1"
                disabled={isProcessing}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-[#3d9cfb] text-white px-4 py-2 rounded-full hover:bg-[#0052ff] hover:scale-105 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isUploading ? 'Uploading...' : isMinting ? 'Minting...' : 'Mint Series'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}