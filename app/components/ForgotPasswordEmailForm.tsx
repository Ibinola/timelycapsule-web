"use client";

import { Formik, Form, FormikHelpers } from "formik";
import AuthInput, { emailSchema } from "@/app/components/authInput";
import { z } from "zod";

interface EmailFormValues {
  email: string;
}

const ForgotPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (email: string) => void;
}) => {
  const validateForm = (values: EmailFormValues) => {
    const errors: Partial<Record<keyof EmailFormValues, string>> = {};

    try {
      emailSchema.parse(values.email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.email = err.errors[0].message;
      }
    }

    return errors;
  };

  const handleSubmit = (
    values: EmailFormValues,
    { setSubmitting }: FormikHelpers<EmailFormValues>,
  ) => {
    console.log("Reset Password Email Sent To:", values.email);
    setSubmitting(false);
    onSubmit(values.email);
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="w-full flex flex-col items-start justify-center gap-6">
          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full px-4 rounded-xl font-semibold text-center text-[#ffffff]  transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] h-[48px] bg-gradient-to-r from-[#48BB78] to-[#215537] mt-6"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
