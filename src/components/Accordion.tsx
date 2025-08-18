import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-t-[#00FFA6]/30 border-b-[#00170e] border-x-[#00170e] ">
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* className={`w-5 h-5 mr-2 transition-transform duration-300 */}
        <span className=" text-lg font-bold text-[#00FFA6] flex items-center">
          {/* neg */}

          {isOpen ? (
            <svg
              className="mr-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1H19.7647L23 4.88235V23H1V1Z"
                fill="#00FFA6"
                fill-opacity="0.1"
                stroke="#00FFA6"
              />
              <mask
                id="mask0_361_3678"
                maskUnits="userSpaceOnUse"
                x="5"
                y="5"
                width="14"
                height="14"
              >
                <rect x="5" y="5" width="14" height="14" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_361_3678)">
                <path
                  d="M8.5 12.5832V11.4165H15.5V12.5832H8.5Z"
                  fill="#00FFA6"
                />
              </g>
            </svg>
          ) : (
            <svg
              className="mr-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1H19.7647L23 4.88235V23H1V1Z"
                fill="#00FFA6"
                fill-opacity="0.1"
                stroke="#00FFA6"
              />
              <mask
                id="mask0_361_3679"
                maskUnits="userSpaceOnUse"
                x="5"
                y="5"
                width="14"
                height="14"
              >
                <rect x="5" y="5" width="14" height="14" fill="#00FFA6" />
              </mask>
              <g mask="url(#mask0_361_3679)">
                <path
                  d="M11.417 12.5832H7.91699V11.4165H11.417V7.9165H12.5837V11.4165H16.0837V12.5832H12.5837V16.0832H11.417V12.5832Z"
                  fill="#00FFA6"
                />
              </g>
            </svg>
          )}

          {/* <PlusIcon
            className={`w-5 h-5 mr-2 transition-transform duration-300 ${isOpen ? "rotate-45" : ""
              }`}
          /> */}
          {title}
        </span>
      </div>
      {isOpen && (
        <div className="px-1 border-t border-[#00FFA6]/30">{children}</div>
      )}
    </div>
  );
};
