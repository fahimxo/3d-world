import React from "react";
import MenuIcon from "../../assets/icons/MenuIcon";
import Search from "../../assets/icons/SearchIcon";

export const Headers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-[45px]">
      <div className="w-full px-8 pt-[33px] flex items-center justify-between">
        <p className="font-normal text-[26px] leading-[100%] tracking-[0px] text-cyan-300 orbitron-font">
          {children}
        </p>
        <div className="relative w-[443px] h-[44px]">
          <Search />
          <div className="relative w-full h-full">
            <input
              type="text"
              placeholder="Enter club name or city"
              className="w-full h-full bg-transparent border-none outline-none pl-12 pr-4 text-cyan-300 placeholder-cyan-400/50 font-medium text-sm"
            />
          </div>
        </div>
        <MenuIcon onClick={() => console.log("Menu clicked")} />
      </div>
      <div className="mt-6 h-[1px] bg-cyan-500/30 w-full" />
    </div>
  );
};
