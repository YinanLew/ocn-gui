"use client";
import { signIn, getCsrfToken } from "next-auth/react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/utils/languageContext";

export default function SignIn() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [resetError, setResetError] = useState<string>();
  const [isResettingPassword, setIsResettingPassword] =
    useState<boolean>(false);
  const { translations } = useLanguage();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token ?? null); // Ensure csrfToken is set to null if undefined
    };
    fetchCsrfToken();
  }, []);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false, // No automatic redirection
        email,
        password,
        callbackUrl: `/`,
      });

      if (result?.error) {
        setError("Login failed: wrong email or password");
        console.log(result.error); // Debug the error
      } else {
        // Optionally handle successful login or redirect here
        window.location.href = result?.url || "/";
      }
    } catch (error) {
      console.error("Login request failed", error);
      setError("Failed to login.");
    }
  };

  const handlePasswordResetRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8500/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resetEmail }),
        }
      );

      if (response.ok) {
        await response.json();
        setIsResettingPassword(false);
      } else {
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          setResetError(errorData.message);
        } else {
          const errorText = await response.text();
          setResetError(errorText);
        }
      }
    } catch (error) {
      console.error("Password reset request failed", error);
      if (error instanceof Error) {
        setResetError(`Password reset request failed: ${error.message}`);
      } else {
        setResetError(
          "Password reset request failed due to an unexpected error."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-[80%]">
      {isResettingPassword ? (
        <form
          onSubmit={handlePasswordResetRequest}
          className="flex flex-col w-full max-w-md p-8 rounded-lg shadow-md space-y-4"
        >
          {resetError && (
            <div className="text-red-500 text-center mb-4">{resetError}</div>
          )}
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder={translations.strings.email}
            required
            className="mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {translations.strings.resetPassword}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsResettingPassword(false);
              setResetError("");
              setError("");
            }}
            className="mt-2 p-2 bg-foreground-300 rounded hover:bg-gray-400"
          >
            {translations.strings.cancel}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSignIn}
          className="flex flex-col w-full max-w-md p-8 rounded-lg shadow-md space-y-4"
        >
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={csrfToken ?? ""}
          />

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <label
            htmlFor="email"
            className="flex flex-col gap-1 text-foreground"
          >
            {translations.strings.email}:
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations.strings.email}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </label>

          <label
            htmlFor="password"
            className="flex flex-col gap-1 text-foreground"
          >
            {translations.strings.password}:
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translations.strings.password}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </label>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {translations.strings.login}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsResettingPassword(true);
              setError("");
              setResetError("");
            }}
            className="mt-2 p-2 bg-foreground-300 rounded hover:bg-gray-400"
          >
            {translations.strings.forgotPassword}
          </button>
        </form>
      )}
    </div>
  );
}
