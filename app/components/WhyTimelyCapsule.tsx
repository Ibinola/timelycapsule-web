"use client";

import Image from "next/image";
//import Button from "../components/Button";

export default function WhyTimelyCapsule() {
  return (
    <section className="w-full flex flex-col items-center py-20 px-8 max-w-7xl mx-auto">
      {/* Statistics Section */}
      <div className="w-full text-center mb-24">
        <h2 className="text-2xl font-bold mb-12">
          Thousands Are Using TimelyCapsule
        </h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-[55px]">
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-black mb-2">500+</h3>
            <p className="text-gray-500 text-sm">User Trust</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-black mb-2">1M+</h3>
            <p className="text-gray-500 text-sm">Capsule Created</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-black mb-2">$10M+</h3>
            <p className="text-gray-500 text-sm">Crypto Gift Sent</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-black mb-2">35K+</h3>
            <p className="text-gray-500 text-sm">Registered Users</p>
          </div>
        </div>
      </div>

      {/* Why TimelyCapsule Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Left side: Steps */}
        <div className="flex flex-col gap-8 w-full md:w-1/2">
          <h2 className="text-4xl font-bold text-black mb-4">
            Why TimelyCapsule?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Create a Capsule in 3 Step Simple. Powerful. Magical.
          </p>

          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg mb-2">Time-Locked Delivery</h4>
              <p className="text-gray-600 text-base">
                Ligula risus auctor tempus feugiat dolor lacinia nemo pur ipsum
                purus sapien quaerat a primis viverra tellus vitae dolor ipsum n
                eque ligula quaerat
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg mb-2">Crypto & Cash Gifting</h4>
              <p className="text-gray-600 text-base">
                Ligula risus auctor tempus feugiat dolor lacinia nemo pur ipsum
                purus sapien quaerat a primis viverra tellus vitae dolor ipsum n
                eque ligula quaerat
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg mb-2">Hybrid Security</h4>
              <p className="text-gray-600 text-base">
                Ligula risus auctor tempus feugiat dolor lacinia nemo pur ipsum
                purus sapien quaerat a primis viverra tellus vitae dolor ipsum n
                eque ligula quaerat
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Image */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <Image
            src="/capsule-dashboard-placeholder.png" // <-- Use any image you want
            alt="Dashboard Example"
            width={500}
            height={400}
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
