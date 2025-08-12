// src/components/Checkbox.tsx
import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean, name: string) => void;
  name: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  name,
}) => {
  return (
    <label
      htmlFor={name}
      className="flex items-center cursor-pointer text-cyan-300/80"
    >
      <div className="relative">
        <input
          id={name}
          name={name}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked, name)}
        />
        <div
          className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
            checked ? "bg-cyan-400 border-cyan-400" : "border-cyan-300/50"
          }`}
        >
          {checked && (
            <svg
              className="w-4 h-4 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="ml-3 font-bold">{label}</span>
    </label>
  );
};
