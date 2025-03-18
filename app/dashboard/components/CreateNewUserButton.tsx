"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";

export const CreateNewUserButton = () => {
  const router = useRouter();
  return (
    <Button
      className="text-xl cursor-pointer"
      onClick={() => {
        router.push("/dashboard/users/new");
      }}
    >
      <span>Create a new user</span>
    </Button>
  );
};

export default CreateNewUserButton;
