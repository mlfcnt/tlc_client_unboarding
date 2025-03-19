import {useOnboardRequests} from "./useOnboardRequests";
import {stepByStatus} from "@/app/constants/OnboardingStatuses";

export const useUsersPerStep = () => {
  const {data, ...rest} = useOnboardRequests();
  return {
    ...rest,
    raw: data,
    data: (data?.data || []).map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      currentStep:
        stepByStatus[user.status as keyof typeof stepByStatus].stepId,
    })),
  };
};

export const useUsersAtStep = () => {
  const {data} = useUsersPerStep();
  const getUsersAtStep = (stepId: number | null | undefined) => {
    if (!stepId) return [];
    return data?.filter((user) => user.currentStep === stepId);
  };
  return {getUsersAtStep};
};
