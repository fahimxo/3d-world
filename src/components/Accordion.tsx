import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#00FFA6]/30 rounded-md">
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-[#00FFA6] flex items-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_226_2273"  maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="14">
              <rect width="14" height="14" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_226_2273)">
              <path d="M3.5 7.58329V6.41663H10.5V7.58329H3.5Z" fill="#00FFA6" />
            </g>
          </svg>

          {/* <PlusIcon
            className={`w-5 h-5 mr-2 transition-transform duration-300 ${isOpen ? "rotate-45" : ""
              }`}
          /> */}
          {title}
        </span>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-[#00FFA6]/30">{children}</div>
      )}
    </div>
  );
};
