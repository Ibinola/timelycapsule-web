import Image from "next/image";

export default function CapsuleLabSection() {
  return (
    <section
      className="w-full px-4 py-16"
      style={{
        background:
          "linear-gradient(21.93deg, rgba(52, 211, 153, 0.3) -11.7%, rgba(55, 148, 94, 0.3) 82.12%)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-18">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
            CapsuleLab
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-800">
            Where memory, time, and identity become experiments.
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-700">
            A sandbox of interactive, time-warped features inspired by the core
            TimelyCapsule experience.
            <br />
            Think emotional time capsules, geo-tagged secrets, identity games,
            and unexpected messages from your past and future selves.
          </p>
          <p className="mt-4 italic text-gray-600">
            Push the boundaries of what memory can be.
          </p>
          <button className="mt-6 bg-white text-green-600 font-semibold py-2 px-6 rounded-full border border-green-500 hover:bg-green-100 transition">
            Coming Soon!
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/images/capsulelab-illustration.png"
            alt="CapsuleLab Illustration"
            width={500}
            height={400}
            className="w-full max-w-xs sm:max-w-md md:max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
