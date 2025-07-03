import DashboardHeader from "@/components/DashboardHeader";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
      <div>
        <DashboardHeader  />

        <main>{children}</main>
      </div>
    </ClerkLoaded>
  );
}
export default DashboardLayout;
