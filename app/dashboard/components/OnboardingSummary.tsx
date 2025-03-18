"use client";

import React from "react";
import {BarChartOnboardingSummary} from "./BarChartOnboardingSummary";
import {Card} from "@/components/ui/card";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SeeMoreBtn from "./SeeAllBtn";

export const OnboardingSummary = () => {
  return (
    <div className="flex flex-col gap-4 p-4 xl mx-auto">
      <Card className="bg-white hover:bg-gray-50 transition-colors w-full">
        <CardHeader>
          <CardTitle>Onboarding summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="w-full max-w-3xl flex flex-col gap-4">
            <BarChartOnboardingSummary />
            <SeeMoreBtn href="/dashboard/onboarding-details" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
