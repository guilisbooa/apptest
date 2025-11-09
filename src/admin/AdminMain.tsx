import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AdminApp } from "./AdminApp";
import { Toaster } from "sonner";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export function AdminMain() {
  return (
    <ConvexProvider client={convex}>
      <AdminApp />
      <Toaster />
    </ConvexProvider>
  );
}
