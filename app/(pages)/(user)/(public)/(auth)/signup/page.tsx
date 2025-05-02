"use client";

import React from "react";
import { Form, Formik, FormikHelpers, Field, ErrorMessage } from "formik";
import { z } from "zod";
import AuthInput, {
  emailSchema,
  passwordSchema,
} from "../../../../../components/authInput";
import Link from "next/link";
import logger from "@/app/utils/logger";
import Image from "next/image";

// Define form value types
interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  walletAddress: string;
}

// Define schema for name validation
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");
// Define schema for wallet address validation
const walletAddressSchema = z
  .string()
  .regex(/^(0x)?[0-9a-fA-F]{40}$/, "Invalid wallet address format");

const SignupPage = () => {
  // Validate form using Zod schemas
  const validateForm = (values: SignupFormValues) => {
    const errors: Partial<Record<keyof SignupFormValues, string>> = {};

    // Log form values for debugging
    logger.debug("Form values for validation:", values);

    // Validate name
    try {
      nameSchema.parse(values.name);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.name = err.errors[0].message;
        logger.warn("Name validation failed:", err.errors[0].message);
      }
    }

    // Validate email
    try {
      emailSchema.parse(values.email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.email = err.errors[0].message;
        logger.warn("Email validation failed:", err.errors[0].message);
      }
    }

    // Validate password
    try {
      passwordSchema.parse(values.password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.password = err.errors[0].message;
        logger.warn("Password validation failed:", err.errors[0].message);
      }
    }

    // Validate password confirmation
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      logger.warn("Password confirmation failed: Passwords do not match");
    }

    // Validate wallet address if provided
    if (values.walletAddress) {
      try {
        walletAddressSchema.parse(values.walletAddress);
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.walletAddress = err.errors[0].message;
          logger.warn(
            "Wallet address validation failed:",
            err.errors[0].message,
          );
        }
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (
    values: SignupFormValues,
    { setSubmitting }: FormikHelpers<SignupFormValues>,
  ) => {
    // Log form submission
    logger.info("Signup form submitted with values:", {
      name: values.name,
      email: values.email,
      passwordLength: values.password.length, // Don't log actual password
      walletAddress: values.walletAddress,
    });

    // TODO: Implement actual signup functionality

    // For demonstration purposes, we're just logging the submission
    console.log("Form submitted:", {
      name: values.name,
      email: values.email,
      walletAddress: values.walletAddress,
    });

    setTimeout(() => {
      setSubmitting(false);
    }, 500);
  };

  return (
    <section className=" flex flex-col w-full md:max-w-[480px] max-h-screen mb-8 xl:pl-10">
      <section className=" flex flex-col justify-start gap-8">
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
            Create new account
          </h2>
          <p className="text-[#78778B] text-[14px] md:text-[16px] mb-4 md:mb-1 font-kumbhSans">
            Welcome! Please enter your details
          </p>
        </div>
      </section>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          walletAddress: "",
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className=" mt-2">
            <AuthInput
              label="Full Name"
              name="name"
              type="email" // Using email type for text input as the component only supports email/password
              placeholder="Enter your full name"
            />

            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email address"
            />

            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
            />

            <AuthInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />

            <div className="space-y-2 mt-2">
              <label
                htmlFor="walletAddress"
                className="text-[14px] font-[500] font-inter py-[8px]"
              >
                Wallet Address
              </label>
              <div className="relative">
                <Field
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  placeholder="Enter your wallet address"
                  className="p-[10px] border rounded-[10px] font-kumbhSans text-[#78778B] text-[16px] leading-[28.16px] font-[400] placeholder:text-[16px] focus:outline-none focus:ring-offset-0 focus:ring-0 w-full"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#48BB78] hover:opacity-80 underline text-sm py-2 px-3 rounded-md transition duration-300 font-kumbhSans"
                  onClick={() => {
                    // Add wallet connection logic here
                    logger.info("Connect wallet button clicked");
                  }}
                >
                  Connect Wallet
                </button>
              </div>
              <ErrorMessage
                name="walletAddress"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className=" mt-10 w-full h-[48px] bg-gradient-to-r from-[#48BB78] to-[#215537] hover:opacity-90 text-white font-medium py-3 px-4 rounded-[10px] transition duration-300 font-kumbhSans"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <div className=" text-center mt-3">
              <span className="text-[14px] text-[#78778B] font-kumbhSans">
                Already have an account?
                <Link
                  href="/login"
                  className="text-[#1A3C34] hover:underline pl-1"
                >
                  Login
                </Link>
              </span>
              <div className="flex justify-center md:pl-44 mt-1">
                <Image
                  src="/images/login-vector.svg"
                  alt="Underline"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default SignupPage;
