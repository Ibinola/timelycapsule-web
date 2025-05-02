"use client";

import ResetPasswordForm from "@/app/components/ResetPasswordForm";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handlePasswordSubmit = (password: string, confirmPassword: string) => {
    setFormData((prev) => ({ ...prev, password, confirmPassword }));
    console.log("Final Form Data:", formData);
  };

  return (
    <div className="w-full h-screen flex items-stretch justify-between">
      {/* Left Section - Form */}
      <section className="w-full bg-[#FFFFFF] flex flex-col items-center justify-center h-full relative p-4">
        <div className="absolute top-[4%] lg:left-[16%] left-[5%]">
          <Image
            src={"/images/timelyCapsule-logo.svg"}
            alt="logo"
            height={49}
            width={73.97}
          />
        </div>

        <ResetPasswordForm onSubmit={handlePasswordSubmit} />
      </section>
    </div>
  );
}
