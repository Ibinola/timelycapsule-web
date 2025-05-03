"use client";

import ForgotPasswordForm from "@/app/components/ForgotPasswordEmailForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleEmailSubmit = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    console.log("Final Form Data:", formData);
    router.push("/reset-password");
  };
  return (
    <section className="flex flex-col w-full md:max-w-[440px]">
      <section className="mb-4 flex flex-col justify-start gap-36">
        {/* Logo */}
        <div className="sm:mt-3 md:mt-6 ">
          <Image
            src="/images/logo-timelycapsule.png"
            alt="Time Capsule"
            width={73}
            height={49}
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-[24px] md:text-[30px] font-bold mb-1 font-kumbhSans text-black">
            Forgot Password ?
          </h2>
          <p className="text-[#78778B] text-[14px] md:text-[16px] mb-4 md:mb-1 font-kumbhSans">
            Kindly enter the email attached to your account.
          </p>
        </div>
      </section>
      <ForgotPasswordForm onSubmit={handleEmailSubmit} />
    </section>
  );
}
