"use client";
import Navbar from "@/components/Navbar";
import { useState, useRef } from "react";
import { useProductSeriesNFT } from "@/hooks/useProductSeriesNFT";

export default function CreateSeries() {
    const { mintSeries, loading, error } = useProductSeriesNFT();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [brandName, setBrandName] = useState("");
    const [description, setDescription] = useState("");
    const [maxSupply, setMaxSupply] = useState<number>(0);
    const [batchNumber, setBatchNumber] = useState<number>(0);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // === Upload file preview ===
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
    };

    // === Upload ke Pinata ===
    const uploadToPinata = async (file: File): Promise<string> => {
        const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
        if (!PINATA_JWT) throw new Error("Missing Pinata JWT token!");

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const metadata = JSON.stringify({
                name: `series-artwork-${brandName}`,
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

            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        } finally {
            setUploading(false);
        }
    };

    // === Handle submit create series ===
    const handleSubmit = async () => {
        try {
            setSuccessMessage(null);

            if (!brandName || !description || !file || !maxSupply || !batchNumber) {
                alert("Please fill all required fields!");
                return;
            }

            const imageURI = await uploadToPinata(file);

            const tx = await mintSeries(
                brandName,
                imageURI,
                description,
                maxSupply
            );

            if (tx) {
                setSuccessMessage("✅ Series successfully created!");
                setBrandName("");
                setDescription("");
                setFile(null);
                setImagePreview(null);
                setMaxSupply(0);
                setBatchNumber(0);
            }
        } catch (err: any) {
            console.error("Error creating series:", err);
            alert(err.message || "Failed to create series");
        }
    };

    // === JSX (unchanged layout) ===
    return (
        <div className=" bg-white-secondary min-h-screen">
            <Navbar />
            <section className="max-w-7xl mx-auto px-6 py-8 text-[#0052FF] pt-20">
                <h2 className="text-2xl font-semibold mb-8">Let’s create your SNAP.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Upload Artwork Section */}
                    <div>
                        <div className="border border-[#0052FF] rounded-3xl bg-white p-6 shadow-md">
                            <div className="border border-[#0052FF] rounded-2xl p-10 flex flex-col items-center justify-center text-center relative">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded-full mb-4 shadow"
                                    />
                                ) : (
                                    <img src="/Upload-icon.svg" alt="" />
                                )}

                                <p className="font-semibold mb-1 text-[#0052FF]">
                                    {imagePreview ? 'Preview artwork' : 'Drop or upload your artwork here.'}
                                </p>
                                <p className="text-xs text-[#0052FF] mb-6">
                                    PNG, JPEG, GIF, WEBP - Max. 4 MB
                                </p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    id="imageUpload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    ref={inputRef}
                                />

                                <label
                                    htmlFor="imageUpload"
                                    className="inline-flex cursor-pointer items-center gap-2 bg-[#0052FF] hover:bg-[#0052FF] active:bg-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF] text-white text-sm font-bold rounded-full px-6 py-3 shadow-[3px_4px_0_rgba(51,38,131,0.8)]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    {imagePreview ? 'Change' : 'Add'} artwork
                                </label>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-[#0052FF] flex items-start gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 shrink-0 text-[#0052FF] mt-[2px]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 18h.01M12 12h.01M12 6h.01"
                                />
                            </svg>
                            <span>
                                <b>Recommended for optimal performance:</b><br />
                                500x500px, rounded shape, less than 200KB<br />
                                Animated pngs are not supported. Use of gif format recommended.
                            </span>
                        </p>
                    </div>

                    {/* Input Fields Section */}
                    <div className="md:col-span-2 space-y-6">
                        {/* SNAP Title */}
                        <div>
                            <label htmlFor="poap-title" className="block text-sm font-semibold mb-1">
                                SNAP Title <span className="text-red-600">*</span>
                            </label>
                            <input
                                id="poap-title"
                                type="text"
                                maxLength={150}
                                placeholder="Give your Series a unique title."
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="w-full bg-white border border-[#0052FF] rounded-md py-2 px-3 text-[#0052FF] placeholder-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent"
                            />
                            <div className="text-right text-xs text-[#0052FF] mt-1">
                                {brandName.length}/150
                            </div>
                        </div>

                        {/* SNAP Description */}
                        <div>
                            <label htmlFor="poap-description" className="block text-sm font-semibold mb-1">
                                SNAP description <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                id="poap-description"
                                maxLength={1500}
                                placeholder="Brand Description."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white border border-[#0052FF] rounded-md py-2 px-3 text-[#0052FF] placeholder-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent min-h-[120px] resize vertical"
                            ></textarea>
                            <div className="text-right text-xs text-[#0052FF] mt-1">
                                {description.length}/1500
                            </div>
                        </div>

                        {/* Quantity & Batch */}
                        <section className="bg-[#eafaff]">
                            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        <span className="bg-gradient-to-r from-[#0052FF] to-blue-500 bg-clip-text text-transparent">
                                            Total Quantity
                                        </span>
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setMaxSupply(Number(e.target.value))}
                                        type="number"
                                        placeholder="Enter the Quantity number (e.g. 1, 2, 3)"
                                        className="w-full bg-white border border-[#0052FF] rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        <span className="bg-gradient-to-r from-[#0052FF] to-blue-500 bg-clip-text text-transparent">
                                            Production Batch
                                        </span>
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        onChange={(e) => setBatchNumber(Number(e.target.value))}
                                        type="number"
                                        placeholder="Enter the batch number (e.g. 1, 2, 3)"
                                        className="w-full bg-white border border-[#0052FF] rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 border-t border-[#0052FF] pt-6 flex justify-end gap-12 items-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || uploading}
                        className="bg-[#0052FF] hover:bg-[#0052FF] active:bg-[#0052FF] text-white font-bold rounded-full px-8 py-3 shadow-[3px_4px_0_rgba(51,38,131,0.8)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {uploading
                            ? "Uploading..."
                            : loading
                            ? "Creating..."
                            : "Create SNAP"}
                    </button>
                    {successMessage && (
                        <p className="text-green-600 text-sm font-medium">{successMessage}</p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm font-medium">⚠️ {error}</p>
                    )}
                </div>
            </section>
        </div>
    );
}
