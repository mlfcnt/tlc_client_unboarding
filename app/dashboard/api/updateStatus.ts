import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {OnboardingStatuses} from "@/app/constants/OnboardingStatuses";
import {REACT_QUERY_KEYS} from "@/app/constants/reactQueryKeys";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {supabase} from "@/lib/supabase";
import {useQueryClient} from "@tanstack/react-query";

export const useUpdateStatusAndInvalidateCache = () => {
  const queryClient = useQueryClient();
  const updateStatus = async ({
    newStatus,
    userId,
  }: {
    newStatus: keyof typeof OnboardingStatuses;
    userId: OnboardingRequest["id"];
  }) => {
    const {data, error} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .update({
        status: newStatus,
      })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.ONBOARDING_REQUESTS],
    });
    return data;
  };
  return {updateStatus};
};
