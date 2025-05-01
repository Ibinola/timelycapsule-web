import Image from "next/image";

export default function HybridSection() {
  return (
    <section className="w-full px-4 py-12 flex flex-col items-center justify-center">
      {/* Highlighted Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white px-6 py-10 w-full max-w-5xl shadow-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Built for the Future</h2>
        <h3 className="text-xl sm:text-2xl font-bold mt-2">
          Hybrid Web2 & Web3 Tech
        </h3>
        <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto">
          TimelyCapsule is built on a scalable hybrid system. Web2 ensures fast
          and familiar UX. Web3 powers secure payments and crypto gifting.
        </p>
        <button className="mt-6 bg-white text-green-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition">
          Get started – its free
        </button>
      </div>

      {/* Tech Icons Section */}
      <div className="mt-10  rounded-md p-4 max-w-xl w-full text-center">
        <div className="flex flex-wrap justify-center items-center gap-10 mb-3">
          <Image
            src="/icons/metamask.png"
            alt="metamask"
            width={40}
            height={50}
          />
          <Image src="/icons/react.png" alt="react" width={40} height={40} />
          <Image src="/icons/nextjs.png" alt="nextjs" width={40} height={40} />
          <Image
            src="/icons/mongodb.png"
            alt="mongodb"
            width={40}
            height={40}
          />
          <Image src="/icons/react.png" alt="react" width={40} height={40} />
          <Image src="/icons/ipfs.png" alt="ipfs" width={40} height={40} />
        </div>
        <p className="text-sm sm:text-base font-medium">
          Powerful Tech Behind The Magic
        </p>
      </div>
    </section>
  );
}
