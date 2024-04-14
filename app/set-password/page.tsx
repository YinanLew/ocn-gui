"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { setNewPassword } from "@/lib/setNewPassword"; // Make sure this path matches your project structure

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPasswordState] = useState("");
  const [confirmPassword, setConfirmPasswordState] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const passwordPolicyRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errors = { newPassword: "", confirmPassword: "" };
    let formIsValid = true;

    if (!passwordPolicyRegex.test(newPassword)) {
      errors.newPassword =
        "Password must include numbers, uppercase, lowercase, and symbols, and be at least 8 characters.";
      formIsValid = false;
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      formIsValid = false;
    }

    setFormErrors(errors);

    if (!formIsValid) {
      return;
    }

    setLoading(true);
    if (token) {
      try {
        await setNewPassword(token, newPassword);
        alert("Password has been successfully reset.");
        // Navigate to login or other appropriate page
      } catch (error: any) {
        console.error("Error resetting password:", error);
        // Handle error (e.g., show message to user)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Reset Your Password</h1>
      <form
        className="w-full flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col sm:flex-row justify-center items-center mb-4">
          <Input
            className="max-w-xs"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPasswordState(e.target.value)}
            placeholder="Enter your new password"
            disabled={loading}
            isInvalid={!!formErrors.newPassword}
            errorMessage={formErrors.newPassword}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-center items-center">
          <Input
            className="max-w-xs"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPasswordState(e.target.value)}
            placeholder="Confirm your new password"
            disabled={loading}
            isInvalid={!!formErrors.confirmPassword}
            errorMessage={formErrors.confirmPassword}
          />
        </div>
        <Button disabled={loading} type="submit">
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
