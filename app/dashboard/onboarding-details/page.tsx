"use client";

import Page from "@/app/components/Page";
import {OnboardingDetailsGrid} from "./components/OnboardingDetailsGrid";
import {useSearchParams} from "next/navigation";
import {OnboardingStatuses} from "@/app/constants/OnboardingStatuses";
export default function OnboardingDetailsPage() {
  const queryParams = useSearchParams();
  const filterByStatus = queryParams.get(
    "status"
  ) as keyof typeof OnboardingStatuses;

  return (
    <Page title="Onboarding Details">
      <OnboardingDetailsGrid filterByStatus={filterByStatus} />
    </Page>
  );
}
