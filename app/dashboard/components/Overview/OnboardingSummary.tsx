import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ShowAllBtn} from "../../SeeAllBtn";
import {supabase} from "@/lib/supabase";
import {
  getOnboardingStatusKeys,
  OnboardingStatuses,
} from "../../../constants/OnboardingStatuses";

const OnboardingSummary = async () => {
  // Get total count of requests
  const {count: totalRequests, error: countError} = await supabase
    .from("onboarding_requests")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (countError) {
    console.error("Error fetching total requests:", countError);
  }

  // Get all status keys
  const statusKeys = getOnboardingStatusKeys();

  // Create an object to store counts by status
  const statusCountsObj: Record<string, number> = {};

  // Initialize all counts to 0
  statusKeys.forEach((key) => {
    statusCountsObj[`${key}_count`] = 0;
  });

  // Get all statuses from the database to count them
  const {data: statusData, error: statusDataError} = await supabase
    .from("onboarding_requests")
    .select("status");

  if (statusDataError) {
    console.error("Error fetching status data:", statusDataError);
  } else if (statusData) {
    // Count occurrences of each status
    statusData.forEach((item: {status: string}) => {
      const status = item.status;
      // Check if the status is a valid key in our OnboardingStatuses
      if (status && statusKeys.some((key) => key === status)) {
        statusCountsObj[`${status}_count`] =
          (statusCountsObj[`${status}_count`] || 0) + 1;
      }
    });
  }

  // Create a statusCounts array with the counts object
  const statusCounts = [statusCountsObj];

  // Filter status keys to only include those with counts > 0
  const statusKeysWithData = statusKeys
    .filter((key) => statusCountsObj[`${key}_count`] > 0)
    // Sort by count in descending order
    .sort(
      (a, b) => statusCountsObj[`${b}_count`] - statusCountsObj[`${a}_count`]
    );

  console.log({totalRequests, statusCounts, statusKeysWithData});
  return (
    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="pb-2">
        <CardTitle>Onboarding Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusKeysWithData.length > 0 ? (
            statusKeysWithData.map((key: string) => {
              // Get the count for this status
              const count = statusCountsObj[`${key}_count`] || 0;

              // Calculate percentage safely with number conversion
              const totalRequestsNum =
                typeof totalRequests === "number" ? totalRequests : 0;
              const percentage =
                totalRequestsNum > 0
                  ? Math.round((count / totalRequestsNum) * 100)
                  : 0;

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {
                        OnboardingStatuses[
                          key as keyof typeof OnboardingStatuses
                        ]
                      }
                    </span>
                    <span className="font-medium">
                      {count}/{totalRequestsNum} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 border border-black">
                    <div
                      className="h-full bg-[#118AB2]"
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-4">
              No onboarding data available
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <ShowAllBtn href="/dashboard/onboarding-details" title="Show details" />
      </CardFooter>
    </Card>
  );
};

export default OnboardingSummary;
