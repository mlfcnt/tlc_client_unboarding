"use client";

import {useToast} from "@/hooks/use-toast";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import React, {useState} from "react";
import {OnboardingRequest} from "../onboarding-details/components/OnboardingDetailsGrid";
import {supabase} from "@/lib/supabase";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export const RequestTesting = () => {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const [selectedRequestId, setSelectedRequestId] = useState<
    OnboardingRequest["id"] | null
  >(null);

  const {data: notStartedUsers, isLoading} = useQuery({
    queryKey: ["onboardingRequests", "not_started"],
    queryFn: async () => {
      const res = await supabase
        .from("onboarding_requests")
        .select("id, first_name, last_name, status")
        .eq("status", getKeyFromValue(OnboardingStatuses.not_started));
      if (res.error) {
        toast({
          title: "Error fetching pending testing",
          description: res.error.message,
        });
      }
      return res.data as OnboardingRequest[];
    },
  });

  const {mutateAsync: notifyTestingDone} = useMutation({
    mutationFn: async (onboardingRequestId: string) => {
      const {data, error} = await supabase
        .from("onboarding_requests")
        .update({
          status: getKeyFromValue(OnboardingStatuses.test_requested),
        })
        .eq("id", onboardingRequestId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Test sent",
        description: "The test has been requested",
        className: "bg-green-500",
      });
      queryClient.invalidateQueries({
        queryKey: ["onboardingRequests"],
        exact: false,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request testing</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : notStartedUsers?.length ? (
          <div className="flex justify-center p-2">
            <Select onValueChange={setSelectedRequestId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {notStartedUsers?.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.first_name} {request.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="ml-2 cursor-pointer"
              disabled={!selectedRequestId}
              onClick={async () => {
                if (selectedRequestId) {
                  try {
                    await notifyTestingDone(selectedRequestId);
                    setSelectedRequestId(null);
                    toast({
                      title: "Test requested",
                      description: "The test has been requested",
                      className: "bg-green-500",
                    });
                  } catch (error: unknown) {
                    toast({
                      title: "Error",
                      description:
                        error instanceof Error
                          ? error.message
                          : "An unknown error occurred",
                    });
                  }
                }
              }}
            >
              Update status
            </Button>
          </div>
        ) : (
          <p>No users to request testing</p>
        )}
      </CardContent>
    </Card>
  );
};
