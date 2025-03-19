"use client";

import {redirect} from "next/navigation";
import {ROLES} from "../constants/Roles";
import {useUser} from "@clerk/nextjs";
import {Title} from "./components/Title";
import {Page} from "./components/Page";
import {Subtitle} from "./components/Subtitle";
import {Steps} from "./components/Steps/Steps";

export default function DashboardPage() {
  const {user} = useUser();
  const userRole = user?.publicMetadata.role as keyof typeof ROLES;
  if (!user || !userRole || ![ROLES.admin, ROLES.sales].includes(userRole)) {
    redirect("/sign-in");
  }

  return (
    <Page>
      <Title />
      <Subtitle />
      <Steps />
    </Page>
  );
}
