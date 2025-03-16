import React from "react";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import SeeMoreBtn from "../SeeAllBtn";

export const UsersListSummary = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">User List </div>
          <SeeMoreBtn href="/dashboard/users" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
