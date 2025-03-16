import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UserRoleDropdown} from "../../users/page";
import {ROLES} from "../../../constants/Roles";
import {clerkClient, currentUser} from "@clerk/nextjs/server";

export const TLCOnboardingTeamSummary = async () => {
  const users = (await (await clerkClient()).users.getUserList()).data;
  const user = await currentUser();
  const isAdmin = user?.publicMetadata.role === ROLES.admin;
  return (
    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle>TLC Onboarding team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users.map((user, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded border border-black p-2 bg-[#f8f8f8]"
            >
              <span className="font-medium">{user.firstName}</span>
              <UserRoleDropdown
                userId={user.id}
                currentRole={user.publicMetadata.role as keyof typeof ROLES}
                readOnly={!isAdmin}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
