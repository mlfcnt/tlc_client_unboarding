import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {ROLES} from "../constants/Roles";
import {Plus} from "lucide-react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";

import {AdminTasks} from "./components/AdminTasks/AdminTasks";
import {SalesTasks} from "./components/SalesTasks/SalesTasks";
import {Overview} from "./components/Overview/Overview";
export default async function DashboardPage() {
  const user = await currentUser();
  const userRole = user?.publicMetadata.role as keyof typeof ROLES;
  if (!user || !userRole || ![ROLES.admin, ROLES.sales].includes(userRole)) {
    redirect("/sign-in");
  }

  try {
    return (
      <div className="flex min-h-screen flex-col bg-[#ffdddd]">
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent border-none">
                <TabsTrigger
                  value="overview"
                  className="border-2 border-black bg-white data-[state=active]:bg-[#FFD166] data-[state=active]:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="border-2 border-black bg-white data-[state=active]:bg-[#06D6A0] data-[state=active]:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Admin Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="sales"
                  className="border-2 border-black bg-white data-[state=active]:bg-[#118AB2] data-[state=active]:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Sales Tasks
                </TabsTrigger>
              </TabsList>

              <Overview />
              <AdminTasks />
              <SalesTasks />
            </Tabs>
          </main>
        </div>
      </div>
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
