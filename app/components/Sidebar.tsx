"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  TrendingUp,
  CreditCard,
  Wallet,
  History,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import Logo from "@/public/images/logo-timelycapsule.png";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: House },
  { name: "Capsules", href: "/capsules", icon: TrendingUp },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "My Wallets", href: "/wallets", icon: Wallet },
  { name: "History", href: "/history", icon: History },
];

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Logout", href: "/logout", icon: LogOut },
];

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  toggleMobileMenu?: () => void;
  setCurrentRouteName?: (name: string) => void;
}

export default function Sidebar({
  isMobileMenuOpen = false,
  toggleMobileMenu = () => {},
  setCurrentRouteName = () => {},
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const currentRoute =
      navItems.find((item) => item.href === pathname) ||
      bottomNavItems.find((item) => item.href === pathname);
    setCurrentRouteName(currentRoute?.name || "");
  }, [pathname, setCurrentRouteName]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <aside
        className={clsx(
          "fixed h-screen bg-gray-50 border-r border-gray-100 transition-all duration-300 z-50",
          isCollapsed ? "w-16" : "w-64",
          isMobileMenuOpen ? "left-0" : "-left-full md:left-0",
        )}
      >
        <div className="flex items-center justify-between p-6 h-[5rem] border-b">
          <Link
            href="/"
            className={clsx("flex", isCollapsed && "justify-center")}
          >
            <Image
              src={Logo}
              alt="Logo"
              className={clsx(isCollapsed ? "w-10 h-10" : "w-auto h-auto")}
            />
          </Link>

          <div className="flex gap-2">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden md:block p-1 rounded-md hover:bg-gray-100"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  isCollapsed ? "justify-center" : "",
                  isActive
                    ? "bg-[#48BB78CC] text-[#1B212D]"
                    : "text-[#929EAE] hover:bg-gray-100",
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon
                  className={clsx(
                    "h-5 w-5",
                    isCollapsed ? "mr-0" : "mr-3",
                    isActive ? "text-[#1B212D]" : "text-gray-400",
                  )}
                />
                {!isCollapsed && (
                  <span
                    className={clsx(
                      "font-semibold font-kumbhSans",
                      isActive ? "text-[#1B212D]" : "text-gray-400",
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pb-6 mt-auto">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center px-4 py-3 text-gray-400 hover:bg-gray-100 rounded-md transition-colors mb-2",
                isCollapsed ? "justify-center" : "",
              )}
              title={isCollapsed ? item.name : ""}
            >
              <item.icon
                className={clsx("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")}
              />
              {!isCollapsed && (
                <span className="font-medium text-gray-400">{item.name}</span>
              )}
            </Link>
          ))}
        </div>
      </aside>

      <div
        className={clsx(
          "hidden md:block transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
        )}
      />
    </>
  );
}
