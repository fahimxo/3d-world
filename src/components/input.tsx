import { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, label, name, ...props }, ref) => {
    // Style for the angled corners using clip-path
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
        {/* Wrapper for the glowing border effect */}
        <div className="relative p-[2px] w-full" style={futuristicClipPath}>
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-blue-600/50 blur-[1px] "
            style={futuristicClipPath}
          ></div>
          <div
            className="relative flex items-center w-full bg-[#0A192F]"
            style={futuristicClipPath}
          >
            {Icon && (
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
            )}
            <input
              type={type}
              name={name}
              id={name}
              className={cn(
                "flex h-12 w-full bg-transparent shadow-[var(--shadow-neon)] border-1 border-primary-200 px-3 py-2 text-base  text-cyan-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cyan-400/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                Icon ? "pl-10" : "",
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
