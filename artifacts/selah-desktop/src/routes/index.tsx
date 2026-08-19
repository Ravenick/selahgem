import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The desktop build has no public marketing experience. Opening the app at
 * its root goes straight to the operator panel.
 */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/panel" });
  },
});