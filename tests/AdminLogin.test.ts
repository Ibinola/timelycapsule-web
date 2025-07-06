import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminLoginPage from "@/components/admin/admin-login";

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

window.alert = jest.fn();

describe("AdminLoginPage", () => {
  test("renders the login form and clock", () => {
    render(<AdminLoginPage />);

    expect(screen.getByText("ADMIN ACCESS")).toBeInTheDocument();
    expect(
      screen.getByText("Secure Authentication Required")
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /PROCEED/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Coordinated Universal Time/i)).toBeInTheDocument();
    expect(
      screen.getByText(/All access attempts are logged and monitored./i)
    ).toBeInTheDocument();
  });

  test("allows typing in email and password fields", () => {
    render(<AdminLoginPage />);
    const emailInput = screen.getByLabelText(
      /Email Address/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /Password/i
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("testpassword");
  });

  test("shows an error if email or password are empty on submit", async () => {
    render(<AdminLoginPage />);
    const submitButton = screen.getByRole("button", { name: /PROCEED/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Email and password are required.")
      ).toBeInTheDocument();
    });
  });

  test("shows an error message for invalid credentials", async () => {
    render(<AdminLoginPage />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /PROCEED/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("handles successful admin login", async () => {
    render(<AdminLoginPage />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /PROCEED/i });

    fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem("adminToken")).toBe(
        "fake-admin-session-token"
      );

      expect(window.alert).toHaveBeenCalledWith(
        "Admin login successful! Redirecting to dashboard..."
      );
    });
  });

  test("shows access denied message for non-admin users", async () => {
    render(<AdminLoginPage />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /PROCEED/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Access denied. You do not have admin privileges.")
      ).toBeInTheDocument();

      expect(localStorage.getItem("adminToken")).toBeNull();
    });
  });

  test("clock updates time periodically", async () => {
    jest.useFakeTimers();
    render(<AdminLoginPage />);

    const initialTime = screen.getByText(/\d{2}:\d{2}:\d{2}/).textContent;

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      const updatedTime = screen.getByText(/\d{2}:\d{2}:\d{2}/).textContent;
      expect(updatedTime).not.toBe(initialTime);
    });

    jest.useRealTimers();
  });
});
