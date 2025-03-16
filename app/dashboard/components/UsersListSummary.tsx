"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Users} from "lucide-react";

export const UsersListSummary = () => {
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-4">View and manage all system users</p>
        <Button
          className="w-full"
          onClick={() => {
            router.push("/dashboard/users");
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          See the user list
        </Button>
      </CardContent>
    </Card>
  );
};
