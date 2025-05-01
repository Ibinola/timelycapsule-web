"use client";

import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserProfileForm from "../components/UserProfileForm";
import WhyTimelyCapsule from "../components/WhyTimelyCapsule";
import Hero from "../components/HowItWorksSection";
import FooterSection from "../components/Footer";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentRouteName, setCurrentRouteName] = useState("");

  const formState = {
    firstName: "Assad",
    lastName: "User1",
    dateOfBirth: "03/02/2025",
    mobileNumber: "090 00 00 00 0",
    email: "user1@gmail.com",
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <Navbar />
      <HeroSection />
      <WhyTimelyCapsule />
      <Hero />
      <FooterSection />

      {/* Layout with Sidebar and Form */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          setCurrentRouteName={setCurrentRouteName}
        />

        {/* Main content */}
        <div className="flex-grow p-6 bg-white min-h-screen">
          <UserProfileForm formState={formState} />
        </div>
      </div>
    </>
  );
}
