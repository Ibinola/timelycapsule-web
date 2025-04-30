"use client";

import { useRouter } from "next/navigation"; // <-- import router
import { Formik, Form, Field } from "formik";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import AuthInput, {
  emailSchema,
  passwordSchema,
} from "../components/authInput";
import Button from "./Button";
import Image from "next/image";

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default function AdminLogin() {
  const router = useRouter(); // <-- initialize router

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      // Simulate login or validate user
      console.log(values);

      // TODO: Add real login/auth logic here

      // Redirect on success
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      // Optionally: show error message to user
    }
  };

  return (
    <div
      className="relative h-screen w-full bg-opacity-70 flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('/images/hand-with-coin.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute sm:top-2 top-0 sm:left-8 left-5">
        <Image
          src="/images/white-TimelyCapsule-logo.png"
          alt="Hand with Coin"
          width={70}
          height={70}
          priority
        />
      </div>

      <div className="bg-white p-6 sm:p-8 shadow-lg w-full max-w-[400px] rounded-lg">
        <h2 className="text-center text-xl font-semibold mb-2">Log In</h2>
        <p className="text-center text-gray-500 mb-6">
          Access admin dashboard.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(loginSchema)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <AuthInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                width="100%"
                variant="admin"
              />
              <AuthInput
                label="Password"
                name="password"
                type="password"
                placeholder="******"
                width="100%"
                variant="admin"
              />
              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  className="w-4 h-4 rounded border-gray-300 focus:ring-green-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 underline"
                >
                  Remember Me
                </label>
              </div>
              <Button
                label="PROCEED"
                type="submit"
                color="primary"
                gradient="r"
                disabled={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
