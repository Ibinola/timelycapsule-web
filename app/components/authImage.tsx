"use client";

import React from "react";
import Image from "next/image";

interface AuthImageProps {
  title: string;
  className?: string | number;
  mainImage: {
    src: string;
    alt: string;
  };
  capsuleImage?: {
    src: string;
    alt: string;
  };
}

const AuthImage: React.FC<AuthImageProps> = ({
  title,
  mainImage,
  capsuleImage,
}) => {
  return (
    <div
      className={`hidden md:w-[45%] md:flex  md:flex-col md:h-screen relative`}
    >
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src={mainImage.src}
          alt={mainImage.alt}
          fill
          className=" object-cover"
        />
      </div>
      <div className="bg-[#1B212D] absolute top-0 bottom-0 left-0 right-0 opacity-20" />
      <div className=" py-8 lg:px-8 text-white bg-[#1A3C34] text-center mt-[-10%] z-10 h-[20%] relative">
        <div className="relative w-full">
          <h3 className="text-[20px] pb-3 font-bold font-kumbhSans">
            {title.split("\\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < title.split("\\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h3>

          {capsuleImage && (
            <Image
              src={capsuleImage.src}
              alt={capsuleImage.alt}
              width={100}
              height={100}
              className="object-contain absolute md:right-[2%] lg:right-[15%] bottom-[40%] z-20"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthImage;
