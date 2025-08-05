import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
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

const ComboboxMenu = ({
  options,
  value,
  onChange,
  setOpen,
  setSearchValue,
  searchValue,
  searchPlaceholder,
  name,
  triggerRef,
  futuristicClipPath,
}) => {
  const [position, setPosition] = useState({});
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen, triggerRef]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const portalContainer = document.getElementById("portal-root");
  if (!portalContainer) {
    console.error(
      "The element with id 'portal-root' was not found. Please add <div id='portal-root'></div> to your index.html"
    );
    return null;
  }

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 p-[2px] animate-in fade-in-0 zoom-in-95"
      style={{ ...position, ...futuristicClipPath }}
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
    </div>,
    portalContainer
  );
};

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

  const triggerRef = useRef<HTMLButtonElement>(null);

  const futuristicClipPath = {
    clipPath:
      "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
  };

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
        <div className="p-[2px]" style={futuristicClipPath}>
          <button
            ref={triggerRef}
            role="combobox"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="relative flex h-12 w-full shadow-[var(--shadow-neon)] items-center justify-between bg-[#0A192F] px-3 py-2 text-base text-cyan-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          <ComboboxMenu
            options={options}
            value={value}
            onChange={onChange}
            setOpen={setOpen}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchPlaceholder={searchPlaceholder}
            name={name}
            triggerRef={triggerRef}
            futuristicClipPath={futuristicClipPath}
          />
        )}
      </div>
    </div>
  );
};

export default Combobox;
