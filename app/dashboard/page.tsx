import {Metadata} from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard - TLC Onboarding",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
