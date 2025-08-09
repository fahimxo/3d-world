import React, { useState } from "react";
import MenuIcon from "../../assets/icons/MenuIcon";
import Search from "../../assets/icons/SearchIcon";
import { SciFiMenuBorder } from "../../assets/icons/SciFiMenuBorder";
import { HamburgerMenu } from "../../assets/icons/hamburgerMenu";

export const Headers = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full px-[45px]">
      <div className="w-full px-8 pt-[33px] flex items-center justify-between relative">
        <p className="font-normal text-[26px] text-cyan-300 orbitron-font">
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

        <div className="relative">
          {isMenuOpen ? (
            <HamburgerMenu
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          ) : (
            <MenuIcon
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          )}
          {isMenuOpen && (
            <div className="absolute top-12 right-[-10px]">
              <SciFiMenuBorder>
                <div className="flex flex-col items-start gap-4 px-6 py-4 text-cyan-300 font-orbitron">
                  <span className="hover:text-cyan-400 cursor-pointer">
                    Sign in
                  </span>
                  <span className="hover:text-cyan-400 cursor-pointer">
                    Settings
                  </span>
                </div>
              </SciFiMenuBorder>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 h-[1px] bg-cyan-500/30 w-full" />
    </div>
  );
};
