"use client";

import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useToast} from "@/hooks/use-toast";
import {supabase} from "@/lib/supabase";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import React, {useState} from "react";
import {OnboardingRequest} from "../onboarding-details/components/OnboardingDetailsGrid";

export const NotifyTestingDone = () => {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const [selectedRequestId, setSelectedRequestId] = useState<
    OnboardingRequest["id"] | null
  >(null);

  const {data: pendingTesting, isLoading} = useQuery({
    queryKey: ["onboardingRequests"],
    queryFn: async () => {
      const {data, error} = await supabase
        .from("onboarding_requests")
        .select("*")
        .eq("status", getKeyFromValue(OnboardingStatuses.test_sent));
      if (error) {
        toast({
          title: "Error fetching pending testing",
          description: error.message,
        });
      }
      return data;
    },
  });

  console.log({pendingTesting});

  const {mutateAsync: notifyTestingDone} = useMutation({
    mutationFn: async (onboardingRequestId: string) => {
      const {data, error} = await supabase
        .from("onboarding_requests")
        .update({
          status: getKeyFromValue(OnboardingStatuses.test_done),
        })
        .eq("id", onboardingRequestId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Testing done",
        description: "Thank you for notifying testing done",
        className: "bg-green-500",
      });
      queryClient.invalidateQueries({
        queryKey: ["onboardingRequests"],
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
        <CardTitle>Set testing status to done</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : pendingTesting?.length ? (
          <div className="flex justify-center p-2">
            <Select onValueChange={setSelectedRequestId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {pendingTesting?.map((request) => (
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
                      title: "Testing done",
                      description: "Thank you for notifying testing done",
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
          <p>No pending testing requests</p>
        )}
      </CardContent>
    </Card>
  );
};
