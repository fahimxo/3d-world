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
          <PlusIcon
            className={`w-5 h-5 mr-2 transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
          />
          {title}
        </span>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-[#00FFA6]/30">{children}</div>
      )}
    </div>
  );
};
