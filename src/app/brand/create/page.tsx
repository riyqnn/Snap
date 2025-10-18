"use client";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useBrandRegistry } from "@/hooks/useBrandRegistry";

export default function CreateBrand() {
  const { mintBrand, loading, error } = useBrandRegistry();

  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickBrowse = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  // 📦 Upload ke IPFS via Pinata
  const uploadToPinata = async (file: File): Promise<string> => {
    const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!PINATA_JWT) throw new Error("Missing Pinata JWT token!");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const metadata = JSON.stringify({
        name: `brand-logo-${brandName}`,
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

      // URL Gateway publik IPFS
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSuccessMessage(null);
      if (!brandName || !description || !file) {
        alert("Please fill all required fields!");
        return;
      }

      const logoURI = await uploadToPinata(file);
      const tx = await mintBrand(brandName, logoURI, description);

      if (tx) {
        setSuccessMessage("✅ Brand successfully submitted for verification!");
        setBrandName("");
        setDescription("");
        setFile(null);
        setPreviewUrl(null);
      }
    } catch (err: any) {
      console.error("Error minting brand:", err);
      alert(err.message || "Failed to submit brand");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full h-fit py-20 flex justify-center items-center bg-[url('/create-brand-background.png')] bg-cover bg-center">
        <div className="bg-white max-w-xl md:w-xl mx-auto p-6 md:p-10 rounded-xl border-2 border-blue-300 shadow-sm space-y-6 my-6">
          {/* Brand Name */}
          <div>
            <label className="block font-semibold text-sm mb-1 text-[#0052FF]">
              Brand Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter your Brand Name..."
              className="w-full border border-[#0052FF] rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
            />
          </div>

          {/* Brand Logo Upload */}
          <div>
            <label className="block font-semibold text-sm mb-1 text-[#0052FF]">
              Brand Logo<span className="text-red-500 ml-1">*</span>
            </label>
            <div
              onClick={handleClickBrowse}
              className="w-full border-2 border-dashed border-[#0052FF] rounded-md p-6 text-center text-sm text-gray-600 cursor-pointer hover:bg-purple-50 transition"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-32 object-contain"
                />
              ) : (
                <>
                  <img
                    src="/Upload-icon.svg"
                    alt="Upload"
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p>
                    Drag & drop your logo or{" "}
                    <span className="text-[#0052FF] font-medium hover:underline">
                      Browse
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: JPEG, PNG, PDF – Up to 10{" "}
                    <span className="font-medium">GB</span>
                  </p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, application/pdf"
                onChange={handleFileChange}
                hidden
              />
            </div>
          </div>

          {/* Brand Description */}
          <div>
            <label className="block font-semibold text-sm mb-1 text-[#0052FF]">
              Brand Description<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your brand, its story, and what makes it unique..."
              className="w-full border border-[#0052FF] rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="px-6 py-3 bg-gradient-to-r from-[#0052FF] to-[#0052FF] text-white font-semibold rounded-full shadow hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Uploading to IPFS..."
                : loading
                ? "Submitting..."
                : "Submit for Verification"}
            </button>

            {successMessage && (
              <p className="text-green-600 text-sm mt-3 font-medium">
                {successMessage}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm mt-3 font-medium">
                ⚠️ {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
