"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export const UsersListSummary = () => {
  const router = useRouter();
  return (
    <Button
      className="text-xl cursor-pointer "
      onClick={() => {
        router.push("/dashboard/users");
      }}
    >
      See the user list
    </Button>
  );
};
