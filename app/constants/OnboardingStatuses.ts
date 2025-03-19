export const OnboardingStatuses = {
  lead_created: "Lead created",
  test_sent: "Test sent",
  test_completed: "Test completed",
  class_proposed: "Class proposed",
  class_confirmed: "Class confirmed",
  class_refused: "Class refused",
  contract_requested: "Contract requested",
  contract_sent: "Contract sent",
  contract_signed: "Contract signed",
  activated: "Activated",
  introduction_confirmed: "Introduction confirmed",
} as const;

// Utility function to get the key from a value
export const getKeyFromValue = (
  value: string
): keyof typeof OnboardingStatuses | undefined => {
  const entries = Object.entries(OnboardingStatuses);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = entries.find(([_, val]) => val === value);
  return entry ? (entry[0] as keyof typeof OnboardingStatuses) : undefined;
};

// Utility function to get all keys
export const getOnboardingStatusKeys =
  (): (keyof typeof OnboardingStatuses)[] => {
    return Object.keys(
      OnboardingStatuses
    ) as (keyof typeof OnboardingStatuses)[];
  };

export type StepOwner = "sales" | "admin" | "automatic";

type StepByStatus = Record<
  keyof typeof OnboardingStatuses,
  {
    stepId: number;
    owner: StepOwner;
    description: string;
  }
>;

export const stepByStatus: StepByStatus = {
  lead_created: {
    stepId: 1,
    owner: "admin",
    description: "Clients that don't yet have the test",
  },
  test_sent: {
    stepId: 2,
    owner: "admin",
    description: "Clients that are currently taking the test",
  },
  test_completed: {
    stepId: 3,
    owner: "sales",
    description: "Clients waiting for a class proposal",
  },
  class_proposed: {
    stepId: 4,
    owner: "admin",
    description: "Clients that have been proposed a class",
  },
  class_confirmed: {
    stepId: 5,
    owner: "sales",
    description: "Clients that are waiting for a contract",
  },
  class_refused: {
    stepId: 6,
    owner: "sales",
    description: "Clients that refused the latest class proposal",
  },
  contract_requested: {
    stepId: 7,
    owner: "sales",
    description: "Clients that have requested a contract",
  },
  contract_sent: {
    stepId: 8,
    owner: "admin",
    description: "Clients that have received the contract",
  },
  contract_signed: {
    stepId: 9,
    owner: "sales",
    description: "Clients that have signed the contract",
  },
  activated: {
    stepId: 10,
    owner: "admin",
    description: "Clients that have been activated",
  },
  introduction_confirmed: {
    stepId: 11,
    owner: "sales",
    description: "Clients that have confirmed the introduction",
  },
};
