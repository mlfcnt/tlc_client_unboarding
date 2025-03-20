import {useOnboardRequests} from "./useOnboardRequests";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";

export const useUserRequest = (userId: OnboardingRequest["id"]) => {
  const {data, ...rest} = useOnboardRequests();
  return {
    data: data?.data?.find((x) => x.id === userId) as OnboardingRequest,
    ...rest,
  };
};
