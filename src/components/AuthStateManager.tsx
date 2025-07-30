"use client";

import { useAuthPersistence } from "@/hooks/useAuthPersistence";

interface AuthStateManagerProps {
  children: React.ReactNode;
}

export default function AuthStateManager({ children }: AuthStateManagerProps) {
  useAuthPersistence();

  return <>{children}</>;
}
