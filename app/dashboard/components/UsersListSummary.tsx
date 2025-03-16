"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";

export const UsersListSummary = () => {
  return (
    <Button
      className="text-xl cursor-pointer "
      onClick={() => {
        redirect("/dashboard/users");
      }}
    >
      See the user list
    </Button>
  );
};
