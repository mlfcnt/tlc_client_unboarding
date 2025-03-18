import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {ROLES} from "../constants/Roles";
import Page from "../components/Page";
import {UsersListSummary} from "./components/UsersListSummary";
import CreateNewUserButton from "./components/CreateNewUserButton";
import {OnboardingSummary} from "./components/OnboardingSummary";
import {NotifyTestingDone} from "./components/NotifyTestingDone";
import {RequestTesting} from "./components/RequestTesting";

export default async function DashboardPage() {
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as keyof typeof ROLES;
  if (!user || !userRole || ![ROLES.admin, ROLES.sales].includes(userRole)) {
    redirect("/sign-in");
  }
  const isAdmin = userRole === ROLES.admin;
  try {
    // Dashboard content for authorized users
    return (
      <Page title="Dashboard">
        <div className="bg-white border-4 rounded-2xl overflow-hidden">
          {isAdmin ? <OnboardingSummary /> : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {isAdmin ? <UsersListSummary /> : null}
            <CreateNewUserButton />
            <RequestTesting />
            <NotifyTestingDone />
          </div>
        </div>
      </Page>
    );
  } catch (error) {
    console.error("Error in Dashboard page:", error);

    // Show error message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">
            An error occurred while loading the dashboard. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }
}
