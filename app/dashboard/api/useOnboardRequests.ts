import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {REACT_QUERY_KEYS} from "@/app/constants/reactQueryKeys";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {supabase} from "@/lib/supabase";
import {PostgrestError} from "@supabase/supabase-js";
import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useOnboardRequests = (
  queryOptions?: Partial<
    UseQueryOptions<{
      data: OnboardingRequest[];
      error: PostgrestError | null;
    }>
  >
) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ONBOARDING_REQUESTS],
    queryFn: async () => {
      const {data, error} = await supabase
        .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
        .select("*");
      return {
        error,
        data: data as OnboardingRequest[],
      };
    },
    ...queryOptions,
  });
