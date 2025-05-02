"use client";

import { Formik, Form, FormikHelpers } from "formik";
import AuthInput from "@/app/components/authInput";
import { z } from "zod";

interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (password: string, confirmPassword: string) => void;
}) => {
  const validateForm = (values: PasswordFormValues) => {
    const errors: Partial<Record<keyof PasswordFormValues, string>> = {};

    try {
      passwordSchema.parse(values);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((e) => {
          if (e.path[0] in errors) return;
          errors[e.path[0] as keyof PasswordFormValues] = e.message;
        });
      }
    }

    return errors;
  };

  const handleSubmit = (
    values: PasswordFormValues,
    { setSubmitting }: FormikHelpers<PasswordFormValues>,
  ) => {
    console.log("New Password Set:", values.password);
    setSubmitting(false);
    onSubmit(values.password, values.confirmPassword);
  };

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="w-full flex flex-col items-start justify-center gap-4">
          <AuthInput
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter your new password"
          />
          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
          />

          <button
            disabled={isSubmitting}
            type="submit"
            className="mt-7 w-full px-4 rounded-xl font-semibold text-center text-[#ffffff]  transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] h-[48px] bg-gradient-to-r from-[#48BB78] to-[#215537]   "
          >
            Done{" "}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
