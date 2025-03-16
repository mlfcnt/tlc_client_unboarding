"use client";

import React from "react";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";

export const NewTestingRequest = () => {
  return (
    <Button
      className="text-xl cursor-pointer"
      onClick={() => {
        redirect("/dashboard/testing-request");
      }}
    >
      <span>Submit a new test request</span>
    </Button>
  );
};

export default NewTestingRequest;
