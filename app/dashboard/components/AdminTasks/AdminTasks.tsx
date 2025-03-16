import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {TabsContent} from "@/components/ui/tabs";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Mail,
  TestTube,
} from "lucide-react";
import React from "react";

export const AdminTasks = () => {
  return (
    <TabsContent value="admin" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Confirm Testing Completed</CardTitle>
            <CardDescription>Update test status for users</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-2 border-black m-4 rounded-md overflow-hidden">
              <div className="bg-[#06D6A0] p-2 font-medium text-black">
                Mark student tests as completed
              </div>
              <div className="p-4 space-y-4">
                <div className="border-2 border-black p-2">
                  <span>Select a student</span>
                </div>
                <Button className="w-full bg-[#06D6A0] text-black hover:bg-[#05c090] border-2 border-black">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Schedule Availability</CardTitle>
            <CardDescription>Notify level and start date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-black p-2">
                <span>Select a student</span>
              </div>
              <div className="border-2 border-black p-2">
                <span>Select level</span>
              </div>
              <Button className="w-full bg-[#FFD166] text-black hover:bg-[#ffc040] border-2 border-black">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Set Availability
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Email Test to End User</CardTitle>
            <CardDescription>Send test to users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-black p-2">
                <span>Select a student</span>
              </div>
              <div className="border-2 border-black p-2">
                <span>Select test type</span>
              </div>
              <Button className="w-full bg-[#118AB2] text-black hover:bg-[#0e7a9e] border-2 border-black">
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Test Requests</CardTitle>
            <CardDescription>Pending test requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Maria Garcia", "Alex Smith", "Sarah Johnson"].map(
                (user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-black p-2 bg-[#f8f8f8]"
                  >
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-[#FF5757]" />
                      <span className="font-medium">{user}</span>
                    </div>
                    <Button size="sm" className="h-8 border-2 border-black">
                      Process
                    </Button>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full border-2 border-black hover:bg-gray-100">
              View All Requests
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TabsContent>
  );
};
