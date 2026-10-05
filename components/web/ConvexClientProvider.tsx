"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authClient={authClient as any} // FIXME: better-auth type inference bug with pnpm
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}