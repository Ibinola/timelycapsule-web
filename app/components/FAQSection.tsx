"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is TimelyCapsule?",
    answer:
      "TimelyCapsule is a platform that lets you create digital time capsules—personalized messages, media, or even crypto gifts—that are locked and only become accessible at a specific future date.",
  },
  {
    question: "Do I need an account to create or view a capsule?",
    answer:
      "Yes, an account is required to create or access time capsules for security and personalization purposes.",
  },
  {
    question: "Can I add money or crypto to a capsule?",
    answer:
      "Yes! TimelyCapsule allows crypto deposits in select supported currencies as part of your digital capsule.",
  },
  {
    question: "How are capsules delivered?",
    answer:
      "Capsules are sent via email, links, or stored in your profile and become accessible on the chosen unlock date.",
  },
  {
    question: "What happens when a capsule expires?",
    answer:
      "Once a capsule expires, its content becomes accessible to the intended recipient(s) automatically.",
  },
  {
    question: "What types of files can I include in a capsule?",
    answer:
      "You can include text, images, videos, audio files, and supported document formats.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full px-4 sm:px-6 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-2 mb-8 text-sm sm:text-base">
            A quick guide to help you make the most of your TimelyCapsule
            experience.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-4 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition"
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <span className="text-lg">
                  {openIndex === index ? "▴" : "▾"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-sm sm:text-base text-gray-700 transition-all duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
