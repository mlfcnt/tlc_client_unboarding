"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export const NewTestingRequest = () => {
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Test Request</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-4">
          Create a new testing request for a student
        </p>
        <Button
          className="w-full"
          onClick={() => {
            router.push("/dashboard/testing-request");
          }}
        >
          Submit a new test request
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewTestingRequest;
