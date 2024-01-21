"use client"
import React from "react";
import { SessionProvider } from "next-auth/react";

interface AuthProvidersProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;
