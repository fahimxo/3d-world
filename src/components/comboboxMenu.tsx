import { Check, Search } from "lucide-react";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "./input";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxMenuProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  setOpen: (open: boolean) => void;
  setSearchValue: (value: string) => void;
  searchValue: string;
  searchPlaceholder?: string;
  name?: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  futuristicClipPath?: React.CSSProperties;
}

const ComboboxMenu: React.FC<ComboboxMenuProps> = ({
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

export default ComboboxMenu;
