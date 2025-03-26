"use client";

import {redirect} from "next/navigation";
import {ROLES} from "../constants/Roles";
import {useUser} from "@clerk/nextjs";
import {Title} from "./components/Title";
import {Page} from "./components/Page";
import {Subtitle} from "./components/Subtitle";
import {Steps} from "./components/Steps/Steps";
import {useOnboardRequests} from "./api/useOnboardRequests";
import {Loader2} from "lucide-react";
import {useEffect} from "react";

export default function DashboardClient() {
  const {user, isLoaded} = useUser();
  const userRole = user?.publicMetadata.role as keyof typeof ROLES;

  const {isLoading} = useOnboardRequests();

  useEffect(() => {
    if (
      isLoaded &&
      (!user || !userRole || ![ROLES.admin, ROLES.sales].includes(userRole))
    ) {
      redirect("/sign-in");
    }
  }, [isLoaded, user, userRole]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <Page>
      <Title />
      <Subtitle />
      <Steps />
    </Page>
  );
}
