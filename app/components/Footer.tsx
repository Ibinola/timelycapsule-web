"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

export default function FooterSection() {
  return (
    <footer className="bg-[#0f1f1c] w-full pt-20 text-white relative">
      {/* Footer Links Grid */}
      <div className="max-w-[1197px] mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-[70px] text-sm mb-12">
        {/* Links */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-white mb-4">Links</h4>
          <p>About</p>
          <p>Contact</p>
          <p>Terms & Privacy</p>
          <p>Twitter / X</p>
          <p>FAQs</p>
          <p>How it Works</p>
          <p>Features</p>
        </div>

        {/* What We Offer */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-white mb-4">What We Offer</h4>
          <p>Time-Locked Messages</p>
          <p>Crypto Gifting</p>
          <p>Guest-Friendly Access</p>
          <p>Hybrid Security</p>
        </div>

        {/* Company */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-white mb-4">Company</h4>
          <p>About Us</p>
          <p>Careers</p>
          <p>Become an Investor</p>
        </div>

        {/* Features */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-white mb-4">Features</h4>
          <p>Time tracking</p>
          <p>Productivity Monitoring</p>
          <p>Task Management</p>
          <p>Screenshots</p>
          <p>Time Reports</p>
          <p>Manual Time Tracking</p>
          <p>Track tasks on every OS</p>
          <p>Idle Time Tracking</p>
        </div>

        {/* Contacts */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-white mb-4">Contacts</h4>
          <p>Send us an e-mail</p>
          <p>support@timelycapsule.com</p>
          <p>24/7 Support Chat</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mx-auto w-[1197px]"></div>

      {/* Social + description */}
      <div className="max-w-[1197px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 py-10">
        {/* Social Icons */}
        <div className="flex gap-6 text-gray-400">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={20} className="hover:text-white transition" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={20} className="hover:text-white transition" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPinterestP size={20} className="hover:text-white transition" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={20} className="hover:text-white transition" />
          </a>
        </div>

        {/* Company Description */}
        <p className="text-sm text-gray-400 max-w-3xl">
          <span className="text-green-500 font-semibold">TimelyCapsule</span> is
          a web-based platform that lets you create, seal, and send time-locked
          messages, media, or crypto gifts. Whether it’s a heartfelt note, a
          surprise video, or a crypto inheritance, we make every moment
          unforgettable.
        </p>
      </div>
      {/* Bottom copyright */}
      <div className="text-center text-gray-600 text-xs py-4">
        © 2025 TimelyCapsule. All rights reserved.
      </div>
    </footer>
  );
}
