"use client";

import React from "react";
import {BarChartOnboardingSummary} from "./BarChartOnboardingSummary";
import {Card} from "@/components/ui/card";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";

export const OnboardingSummary = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-screen-xl mx-auto">
      <Card
        className="cursor-pointer bg-white hover:bg-gray-50 transition-colors w-full"
        onClick={() => {
          router.push("/dashboard/testing-request");
        }}
      >
        <CardHeader>
          <CardTitle>Onboarding summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="w-full max-w-3xl">
            <BarChartOnboardingSummary />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
