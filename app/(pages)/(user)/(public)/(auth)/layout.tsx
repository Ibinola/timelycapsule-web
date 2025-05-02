"use client";

import AuthImage from "@/app/components/authImage";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" min-h-svh flex items-center justify-center h-screen bg-[#FAFAFA] w-full ">
      <section className="w-full md:w-[55%] px-6 pt-14 flex flex-col items-center md:items-start lg:pl-24 xl:pl-32 h-full overflow-y-scroll hide-scrollbar">
        {children}
      </section>
      <AuthImage
        title="Unleash the Power of\nTimed Messaging"
        className="hidden md:block"
        mainImage={{
          src: "/images/login-img.png",
          alt: "Hand holding clock",
        }}
        capsuleImage={{
          src: "/images/login-capsule.png",
          alt: "Time Capsule",
        }}
      />
    </main>
  );
}
