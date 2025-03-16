import {Badge} from "@/components/ui/badge";
import React from "react";
import {clerkClient as clerk} from "@clerk/nextjs/server";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import SeeMoreBtn from "../SeeAllBtn";

export const UsersListSummary = async () => {
  const clerkClient = await clerk();
  const allUsers = await clerkClient.users.getUserList();
  const pendingRoleUsers = allUsers.data.filter(
    (x) => !x.publicMetadata.role
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            User List{" "}
            <Badge
              className={`ml-2 ${pendingRoleUsers ? "bg-amber-300" : ""}`}
              variant="neutral"
            >
              {pendingRoleUsers} pending
            </Badge>
          </div>
          <SeeMoreBtn href="/dashboard/users" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
