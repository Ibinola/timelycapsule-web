"use client";

import React from "react";
import Image from "next/image";
import { Form, Formik, FormikHelpers } from "formik";
import AuthInput from "@/app/components/authInput";
import Button from "@/app/components/Button";
import { z } from "zod";
import { emailSchema, passwordSchema } from "@/app/components/authInput";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const validateForm = (values: LoginFormValues) => {
    const errors: Partial<Record<keyof LoginFormValues, string>> = {};

    try {
      emailSchema.parse(values.email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.email = err.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(values.password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.password = err.errors[0].message;
      }
    }

    return errors;
  };

  const handleSubmit = (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>,
  ) => {
    console.log("Login attempt", values);
    setSubmitting(false);
  };

  return (
    <div className=" flex flex-col w-full md:max-w-[440px]">
      <section className="mb-4 flex flex-col justify-start gap-20">
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
            Welcome back
          </h2>
          <p className="text-[#78778B] text-[14px] md:text-[16px] mb-4 md:mb-1 font-kumbhSans">
            Welcome back! Please enter your details
          </p>
        </div>
      </section>

      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="">
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              variant="user"
              className="[&_input]:h-[24px] [&_input]:text-[12px] [&_label]:text-[12px] [&_label]:py-[6px] bg-white"
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              variant="user"
              className="[&_input]:h-[36px] [&_input]:text-[14px] [&_label]:text-[12px] [&_label]:py-[6px]"
            />

            <div className="flex flex-col md:flex-row mt-3 text-[#1B212D] justify-between items-start md:items-center gap-3 md:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={values.rememberMe}
                  onChange={(e) =>
                    setFieldValue("rememberMe", e.target.checked)
                  }
                  className="h-4 w-4 text-[#34C759] border-[#F2F2F2] rounded focus:ring-[#34C759]"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-[14px] font-kumbhSans"
                >
                  Remember for 30 Days
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[14px] hover:underline font-kumbhSans"
              >
                Forgot password
              </Link>
            </div>

            <Button
              type="submit"
              label="Sign in"
              className={`mt-10 w-full h-[48px] text-center !bg-gradient-to-r from-[#48BB78] to-[#1B212D] text-white rounded-[10px] font-kumbhSans font-medium ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "Coinbase Wrapped Bitcoin"
              } transition-colors`}
              disabled={isSubmitting}
            />

            <div className=" text-center mt-3">
              <span className="text-[14px] text-[#78778B] font-kumbhSans">
                Don&apos;t have an account?
                <a href="#" className="text-[#1A3C34] hover:underline">
                  Sign up for free
                </a>
              </span>
              <div className="flex justify-center md:pl-52 mt-1">
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
    </div>
  );
};

export default Login;
