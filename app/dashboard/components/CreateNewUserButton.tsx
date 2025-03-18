"use client";

import React from "react";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";

export const CreateNewUserButton = () => {
  return (
    <Button
      className="text-xl cursor-pointer"
      onClick={() => {
        redirect("/dashboard/users/new");
      }}
    >
      <span>Create a new user</span>
    </Button>
  );
};

export default CreateNewUserButton;
