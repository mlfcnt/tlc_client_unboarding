import React from "react";
import {TabsContent} from "@/components/ui/tabs";
import {currentUser} from "@clerk/nextjs/server";
import {ROLES} from "../../../constants/Roles";
import {redirect} from "next/navigation";
import OnboardingSummary from "./OnboardingSummary";
import {TLCOnboardingTeamSummary} from "./TLCOnboardingTeamSummary";

export const Overview = async () => {
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as keyof typeof ROLES;
  if (!user || !userRole || ![ROLES.admin, ROLES.sales].includes(userRole)) {
    redirect("/sign-in");
  }
  return (
    <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OnboardingSummary />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TLCOnboardingTeamSummary />
      </div>
    </TabsContent>
  );
};
