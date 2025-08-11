// src/components/FileUpload.tsx
import React, { useRef, useState } from "react";

interface FileUploadProps {
  label: string;
  name: string;
  onChange: (file: File | null) => void;
}

const UploadIcon = () => (
  <svg
    className="w-8 h-8 text-[#415C52]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    />
  </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  onChange,
}) => {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName("");
      onChange(null);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full space-y-3">
      <label className="text-sm  text-[#00FFA6] block tracking-wider mb-1">
        {label}
      </label>
      <div
        className="relative flex flex-col items-center justify-center w-full h-23 
        border-2 border-dashed border-[#415C52] rounded-lg 
        cursor-pointer hover:bg-cyan-500/10 transition-colors"
        onClick={handleClick}
      >
        <input
          type="file"
          name={name}
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <UploadIcon />
        <p className="text-xs text-[#415C52]">
          {fileName || "Upload club logo"}
        </p>
      </div>
    </div>
  );
};
