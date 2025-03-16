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
import {CheckCircle} from "lucide-react";

export const NotifyTestingDone = () => {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const [selectedRequestId, setSelectedRequestId] = useState<
    OnboardingRequest["id"] | null
  >(null);

  const {data: pendingTesting, isLoading} = useQuery({
    queryKey: ["onboardingRequests"],
    queryFn: async () => {
      const res = await supabase
        .from("onboarding_requests")
        .select("*")
        .eq("status", getKeyFromValue(OnboardingStatuses.test_sent));
      if (res.error) {
        toast({
          title: "Error fetching pending testing",
          description: res.error.message,
        });
      }
      return res.data as unknown as {
        data: OnboardingRequest[];
      };
    },
  });

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
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Testing Status</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-4">Mark student tests as completed</p>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : pendingTesting?.data?.length ? (
          <div className="flex flex-col gap-4">
            <Select onValueChange={setSelectedRequestId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {pendingTesting?.data?.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.first_name} {request.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="w-full cursor-pointer"
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
              <CheckCircle className="mr-2 h-4 w-4" />
              Update status
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-2">
            No pending testing requests
          </p>
        )}
      </CardContent>
    </Card>
  );
};
