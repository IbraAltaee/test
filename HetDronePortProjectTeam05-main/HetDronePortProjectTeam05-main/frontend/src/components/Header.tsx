"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaBars, FaTimes, FaCog, FaChevronDown } from "react-icons/fa";
import { CiCalculator1 } from "react-icons/ci";
import { GiDeliveryDrone } from "react-icons/gi";
import { useAuth } from "@/providers/AuthProvider";
import { FaUserPlus } from "react-icons/fa";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout, username, token } = useAuth();

  const handleLoginClick = () => {
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const isActivePath = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return path !== "/" && pathname!.startsWith(path);
  };

  const navigationItems = [
    {
      name: "Calculate",
      path: "/",
      icon: CiCalculator1,
      description: "Drone operation calculator",
    },
    ...(token
      ? [
          {
            name: "Admin Dashboard",
            path: "/dashboard",
            icon: FaCog,
            description: "Zone management",
          },
        ]
      : []),
  ];

  const handleCreateClick = () => {
    router.push("/create");
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GiDeliveryDrone size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  DronePort
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 hidden sm:block">
                  Operations Assistant
                </p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActivePath(item.path)
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="bg-blue-600 p-2 rounded-full">
                    <FaUser size={16} />
                  </div>
                  {token && (
                    <span className="text-sm font-medium hidden xl:block">
                      {username}
                    </span>
                  )}
                  <FaChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    {username ? (
                      <>
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              Signed in as
                            </p>
                            <p className="font-semibold text-gray-900">
                              {username}
                            </p>
                          </div>
                          <button
                            onClick={handleCreateClick}
                            className="text-gray-600 hover:text-gray-800 transition-all duration-200 p-2 rounded border border-gray-300 hover:border-gray-400 hover:bg-white/70 hover:shadow-sm"
                            title="Add new admin"
                          >
                            <FaUserPlus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleNavigation("/dashboard")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <FaCog size={16} />
                          <span>Admin Dashboard</span>
                        </button>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleLoginClick}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {isUserMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;
