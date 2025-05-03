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

      <div className="flex">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          setCurrentRouteName={setCurrentRouteName}
        />
      </div>
    </>
  );
}
