"use client";

import ResetPasswordForm from "@/app/components/ResetPasswordForm";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [Values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const handlePasswordSubmit = (password: string, confirmPassword: string) => {
    setValues((prev) => ({ ...prev, password, confirmPassword }));
    console.log(Values);
  };

  return (
    <section className="flex flex-col w-full md:max-w-[440px]">
      <section className="mb-2 flex flex-col justify-start gap-32">
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
            Reset Password ?
          </h2>
        </div>
      </section>

      <ResetPasswordForm onSubmit={handlePasswordSubmit} />
    </section>
  );
}
