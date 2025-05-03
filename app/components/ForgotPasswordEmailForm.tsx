"use client";

import { Formik, Form, FormikHelpers } from "formik";
import AuthInput, { emailSchema } from "@/app/components/authInput";
import { z } from "zod";
import { useRouter } from "next/navigation";

interface EmailFormValues {
  email: string;
}

const ForgotPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (email: string) => void;
}) => {
  const router = useRouter();
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

  const handleSubmit = async (
    values: EmailFormValues,
    { setSubmitting }: FormikHelpers<EmailFormValues>,
  ) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/reset-password", {
        //hey follow contributor, remember to change this to the correct endpoint to avoid the 404 error
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values.email),
      });

      if (!response.ok) {
        throw new Error("Password reset failed");
      }
      const data = await response.json();
      console.log("Password reset successful", data);
      onSubmit(values.email);
      setSubmitting(false);

      router.push("/login");
    } catch (error) {
      console.error("Error submitting form:", error);
      //  hey follow contributor, i'm just redirecting this to the login page for now. change this to correct page when actual endpoint is available
      router.push("/login");
    }
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
