"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export const CreateNewUserButton = () => {
  const router = useRouter();
  return (
    <Button
      className="text-xl cursor-pointer"
      onClick={() => {
        router.push("/dashboard/users/new");
      }}
    >
      <span>Create a new lead</span>
    </Button>
  );
};

export default CreateNewUserButton;
