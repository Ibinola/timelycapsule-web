"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { Field, ErrorMessage } from "formik";

// Validation schemas
export const emailSchema = z.string().email("Invalid email address");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character");

interface InputProps {
  label: string;
  name: string;
  type: "email" | "password";
  placeholder: string;
  width?: string | number;
  variant?: "user" | "admin";
  className?: string;
}

export default function AuthInput({
  label,
  name,
  type,
  placeholder,
  width,
  variant = "user",
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const variantStyles = {
    user: "border-[#F2F2F2] rounded-[10px] font-kumbhSans text-[#78778B] text-[16px] leading-[28.16px] font-[400]",
    admin:
      "border-gray-400 text-gray-700 font-inter font-kumbhSans text-[16px] leading-[28.16px] font-[400] text-[#616161]",
  };

  return (
    <div
      className={`flex flex-col ${variant == "admin" ? "border" : ""}`}
      style={{
        width: width
          ? typeof width === "string"
            ? width
            : `${width}px`
          : "100%",
      }}
    >
      <label
        htmlFor={name}
        className={`text-[14px] font-[500]  font-kumbhSans ${variant == "user" ? "py-[10px]" : "py-[14px_10px] text-[#424242] font-kumbhSans font-[500] text-[16px] leading-[18.06px]"}`}
      >
        {label}
      </label>
      <div className="relative w-full">
        <Field
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className={`p-[10px] ${variant == "user" ? "border" : ""}
            placeholder:text-[16px] font-kumbhSans focus:outline-none
            focus:ring-offset-0 focus:ring-0 w-full
            ${variantStyles[variant]}`}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-[12px]  font-kumbhSans"
      />
    </div>
  );
}
