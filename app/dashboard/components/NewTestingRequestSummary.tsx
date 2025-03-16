"use client";

import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {redirect} from "next/navigation";
export const NewTestingRequestSummary = () => {
  return (
    <Card
      className="cursor-pointer"
      onClick={() => {
        redirect("/dashboard/testing-request");
      }}
    >
      <CardHeader>
        <CardTitle>New test request</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default NewTestingRequestSummary;
