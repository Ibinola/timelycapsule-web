"use client";
import Sidebar from "@/app/components/admin-component/Sidebar";
import Navbar from "@/app/components/admin-component/Navbar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentRouteName, setCurrentRouteName] = useState("");
  const pathname = usePathname(); // Get the current route

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");
    const pageName =
      pathSegments.length > 0
        ? pathSegments[pathSegments.length - 1]
        : "Dashboard";

    setCurrentRouteName(pageName.charAt(0).toUpperCase() + pageName.slice(1));
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="">
      {isLoginRoute ? (
        <main className="flex-1">{children}</main>
      ) : (
        <div className="flex gap-6">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar
              currentRouteName={currentRouteName}
              toggleMobileMenu={toggleMobileMenu}
            />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      )}
    </div>
  );
}
