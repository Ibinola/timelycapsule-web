"use client";

import Image from "next/image";
import Button from "../components/Button";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[500px] rounded-[24px] border  shadow-lg overflow-hidden mt-16 sm:mt-24 mx-4 sm:mx-8 px-4 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-12"
      style={{
        background:
          "linear-gradient(180deg, rgba(244, 251, 248, 0.8) 50%, rgba(244, 251, 248, 0.05) 100%)",
      }}
    >
      {/* Left Content */}
      <div className="flex flex-col max-w-full md:max-w-[580px] w-full text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 mb-4">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Sealed. Timed. Unforgettable.
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
          Preserve Moments,{" "}
          <span className="text-green-500">Unlock Memories</span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
          TimelyCapsule lets you create, personalize, protect and send{" "}
          <strong>time-locked messages, media</strong>, or{" "}
          <strong>crypto gifts</strong> that unlock only at a chosen moment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
          <Button
            label="🚀 Create a Capsule"
            size="lg"
            style={{
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
            }}
          />
          <Button
            label="🗂️ Explore Capsules"
            size="lg"
            outline
            style={{
              borderColor: "#10B981",
              color: "#10B981",
            }}
          />
        </div>
      </div>

      {/* Right Content */}
      <div className="relative w-full max-w-[525px] h-auto flex items-center justify-center">
        <div className="relative w-full">
          <Image
            src="/phone-user.jpg"
            alt="Person using phone"
            width={525}
            height={334}
            className="w-full h-auto rounded-xl shadow-md transform rotate-2"
          />
          <div className="absolute top-2 left-2 w-full h-full bg-white rounded-xl -z-10 transform rotate-[-3deg]" />
        </div>
      </div>
    </section>
  );
}
