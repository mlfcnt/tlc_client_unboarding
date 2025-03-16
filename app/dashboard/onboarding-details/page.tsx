"use client";

import Page from "@/app/components/Page";
import {OnboardingDetailsGrid} from "./components/OnboardingDetailsGrid";
import {redirect, useSearchParams} from "next/navigation";
import {OnboardingStatuses} from "@/app/constants/OnboardingStatuses";
import {useUser} from "@clerk/nextjs";
import {Suspense} from "react";

function OnboardingDetailsContent() {
  const queryParams = useSearchParams();
  const filterByStatus = queryParams.get(
    "status"
  ) as keyof typeof OnboardingStatuses;

  const {user} = useUser();

  const isAdmin = user?.publicMetadata.role === "admin";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <OnboardingDetailsGrid filterByStatus={filterByStatus} />;
}

export default function OnboardingDetailsPage() {
  return (
    <Page title="Onboarding Details">
      <Suspense fallback={<div>Loading...</div>}>
        <OnboardingDetailsContent />
      </Suspense>
    </Page>
  );
}
