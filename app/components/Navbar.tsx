"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

import Notification from "./Notification";
import UserAvatar from "./UserAvatar";

const Navbar: React.FC<{ toggleMobileMenu?: () => void }> = ({
  toggleMobileMenu = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentRouteName, setCurrentRouteName] = useState("");
  const pathname = usePathname();

  const isDashboard = pathname && pathname.startsWith("/dashboard");

  const notificationsArray = [
    {
      title: "Capsule Name",
      date: "March 14, 2023",
      time: "2:15pm",
      days: 5,
      hours: 12,
      minutes: 30,
      isPrivate: true,
    },
    {
      title: "Not Name",
      date: "March 14, 2023",
      time: "2:15pm",
      days: 5,
      hours: 12,
      minutes: 30,
      isPrivate: false,
    },
  ];

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        const routeName =
          segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
        setCurrentRouteName(routeName);
      } else {
        setCurrentRouteName("Dashboard");
      }
    }
  }, [pathname]);

  if (isDashboard) {
    // Dashboard-style navbar
    return (
      <header className="h-[5rem] sticky top-0 z-30 flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="ml-4 md:ml-0 font-semibold text-2xl text-[#1B212D]">
            {currentRouteName}
          </h1>
        </div>

        {isSearchOpen && (
          <div className="fixed inset-0 bg-white z-50 p-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border-none text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder:text-gray-400"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden md:block relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 rounded-lg bg-gray-50 border-none text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 w-[280px] placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <Notification notifications={notificationsArray} />
            <div className="hidden sm:block h-8 w-[1px] bg-gray-200"></div>
            <UserAvatar name="Assad User1" />
          </div>
        </div>
      </header>
    );
  }

  // Public-facing homepage-style navbar
  return (
    <header className="w-full bg-[#F5F7FA] py-2 shadow">
      <nav className="max-w-[1280px] mx-auto px-6 flex justify-between items-center h-[46px]">
        {/* Logo */}
        <div className="text-xl font-bold text-black">
          <span className="text-[#1B212D] font-semibold">TimelyCap</span>
          <span className="text-green-500">$</span>
          <span className="text-[#1B212D] font-semibold">ule</span>
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-[#1B212D]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[#1B212D] font-medium text-sm">
          <Link href="#">Home</Link>
          <Link href="#">Features</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Resources</Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin">
            <button className="px-5 py-1.5 border border-green-500 text-green-500 rounded-md text-sm hover:bg-green-50 transition">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-1.5 bg-gradient-to-r from-gray-700 to-green-500 text-white rounded-md text-sm hover:opacity-90 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pt-4 pb-2 text-sm font-medium text-[#1B212D] bg-[#F5F7FA]">
          <Link href="#" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)}>
            Features
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)}>
            Pricing
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)}>
            Resources
          </Link>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/signin">
              <button className="w-full px-5 py-1.5 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full px-5 py-1.5 bg-gradient-to-r from-gray-700 to-green-500 text-white rounded-md hover:opacity-90 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
