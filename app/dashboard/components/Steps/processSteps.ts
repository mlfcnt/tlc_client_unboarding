import {
  OnboardingStatuses,
  stepByStatus,
  StepOwner,
} from "@/app/constants/OnboardingStatuses";

export type ProcessStep = {
  id: number;
  name: string;
  owner: StepOwner;
  description: string;
  salesActions: string[];
  adminActions: string[];
};

export const processSteps: ProcessStep[] = Object.entries(stepByStatus).map(
  ([status, {stepId, owner, description}]) => ({
    id: stepId,
    name:
      OnboardingStatuses[status as keyof typeof OnboardingStatuses] ?? status,
    owner,
    description,
    salesActions: [],
    adminActions: [],
  })
);
