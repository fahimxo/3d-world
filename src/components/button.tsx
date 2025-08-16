import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
}

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const btnClipPath = {
    clipPath:
      "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
  };
  const buttonStyles =
    "cursor-pointer relative h-[44px] px-8 flex items-center justify-center text-[14px] font-[700] transition";
  const variantStyles = {
    primary: "bg-cyan-500 text-gray-900 hover:bg-cyan-400",
    secondary: "bg-gray-800 text-cyan-300 hover:bg-gray-700",
    tertiary:
      "text-[#00FFA6] hover:text-[#011231] bg-[rgba(0,255,166,0.10)] hover:bg-[#00FFA6]",
  };

  const glowStyles = "absolute inset-0 bg-cyan-400 blur-md opacity-80";

  return (
    <div className={`relative p-[2px] ${className}`} style={btnClipPath}>
      {variant === "primary" && <div className={glowStyles}></div>}

      <button
        type={type}
        className={`${buttonStyles} ${variantStyles[variant]}`}
        style={btnClipPath}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
