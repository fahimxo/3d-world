import React, { useState, useEffect } from "react";
import MenuIcon from "../../assets/icons/MenuIcon";
import Search from "../../assets/icons/SearchIcon";
import { SciFiMenuBorder } from "../../assets/icons/SciFiMenuBorder";
import { HamburgerMenu } from "../../assets/icons/hamburgerMenu";
import LoginForm from "../../components/LoginForm";
import api from "../../config/axios";
import { API_ENDPOINTS } from "../../config/endpoint";
import { PublicClubFilter } from "src/lib/usePublicClubs";

type HeaderProps = {
  children: React.ReactNode;
  fetchClubs: (payload: PublicClubFilter) => void;
  loading: boolean;
};

export const Headers = ({ children, fetchClubs, loading }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [showLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      fetchClubs({ city: searchValue.trim(), currentName: searchValue.trim() });
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      try {
        await api.post(API_ENDPOINTS.USER.LOGOUT, {
          logoutDto: {
            userId: Number(userId),
            token,
          },
        });
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  const handleSignInClick = () => {
    setShowLogin(true);
    setIsMenuOpen(false);
  };

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
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
        </div>

        <div className="relative flex items-center">
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
            <div className="absolute top-12 right-[-10px] z-20">
              <SciFiMenuBorder>
                <div className="flex flex-col items-start gap-4 px-6 py-4 text-cyan-300 font-orbitron">
                  {!isLoggedIn ? (
                    <span
                      className="hover:text-cyan-400 cursor-pointer"
                      onClick={handleSignInClick}
                    >
                      Sign in
                    </span>
                  ) : (
                    <span
                      className="hover:text-cyan-400 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </span>
                  )}
                </div>
              </SciFiMenuBorder>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 h-[1px] bg-cyan-500/30 w-full" />

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <LoginForm
            onCancel={() => {
              setShowLogin(false);
              setIsLoggedIn(!!localStorage.getItem("token"));
            }}
          />
        </div>
      )}
    </div>
  );
};
