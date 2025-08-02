import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useState } from "react";
import Input from "./input";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  name?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  label,
  name,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const selectedOption = options.find((option) => option.value === value);

  // Style for the angled corners using clip-path
  const futuristicClipPath = {
    clipPath:
      "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full space-y-3">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-bold text-cyan-300/80 block tracking-wider mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {/* Wrapper for the glowing border effect */}
        <div className="p-[2px]" style={futuristicClipPath}>
          <button
            role="combobox"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="relative flex h-12 w-full items-center justify-between bg-[#0A192F] px-3 py-2 text-base text-cyan-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            style={futuristicClipPath}
          >
            {selectedOption ? (
              <span className="truncate">{selectedOption.label}</span>
            ) : (
              <span className="text-cyan-400/50">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </div>

        {open && (
          <div
            className="absolute z-10 mt-2 w-full p-[2px] animate-in fade-in-0 zoom-in-95"
            style={futuristicClipPath}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-blue-600/50 blur-[1px]"
              style={futuristicClipPath}
            ></div>
            <div
              className="relative bg-[#0A192F] text-cyan-200"
              style={futuristicClipPath}
            >
              <div className="p-2">
                <Input
                  placeholder={searchPlaceholder}
                  icon={Search}
                  value={searchValue}
                  name={name}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-auto p-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 mx-1 mb-1 text-base outline-none hover:bg-cyan-400/20"
                    >
                      <span className="truncate flex-1">{option.label}</span>
                      {option.value === value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-cyan-400/60 py-2">
                    No results found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Combobox;
