import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  const btnClipPath = {
    clipPath:
      "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
  };
  return (
    <div className="pt-4">
      <div className="relative p-[2px]" style={btnClipPath}>
        <div className="absolute inset-0 bg-cyan-400 blur-md opacity-80"></div>
        <button
          type={type}
          className="relative w-full h-12 bg-cyan-500 text-gray-900 font-bold text-lg tracking-widest hover:bg-cyan-400 transition-colors duration-300 cursor-pointer"
          style={btnClipPath}
          {...props}
        >
          {children}
        </button>
      </div>
    </div>
  );
};
