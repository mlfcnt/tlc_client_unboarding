import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {REACT_QUERY_KEYS} from "@/app/constants/reactQueryKeys";
import {supabase} from "@/lib/supabase";
import {useQuery} from "@tanstack/react-query";

export const useOnboardRequests = () =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ONBOARDING_REQUESTS],
    queryFn: async () => {
      return supabase.from(DATABASE_TABLES.ONBOARDING_REQUESTS).select("*");
    },
  });
