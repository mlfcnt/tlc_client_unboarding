import {TabsContent} from "@/components/ui/tabs";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronRight, CreditCard, FileText, Plus} from "lucide-react";

export const SalesTasks = () => {
  return (
    <TabsContent value="sales" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Submit Test Request</CardTitle>
            <CardDescription>Request testing for new users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-black p-2">
                <span>Select a student</span>
              </div>
              <div className="border-2 border-black p-2">
                <span>Test type</span>
              </div>
              <Button className="w-full bg-[#FF5757] text-black hover:bg-[#ff4040] border-2 border-black">
                <Plus className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Send Payment Link</CardTitle>
            <CardDescription>Send payment/account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-black p-2">
                <span>Select a student</span>
              </div>
              <div className="border-2 border-black p-2">
                <span>Payment plan</span>
              </div>
              <Button className="w-full bg-[#118AB2] text-black hover:bg-[#0e7a9e] border-2 border-black">
                <CreditCard className="mr-2 h-4 w-4" />
                Send Payment Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Final Information</CardTitle>
            <CardDescription>Submit final user information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-black p-2">
                <span>Select a student</span>
              </div>
              <Button className="w-full bg-[#06D6A0] text-black hover:bg-[#05c090] border-2 border-black">
                <FileText className="mr-2 h-4 w-4" />
                Complete Information Form
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Track payment confirmations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded border border-black p-2 bg-[#f8f8f8]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#06D6A0]" />
                  <span className="font-medium">John Doe</span>
                </div>
                <span className="text-xs font-medium bg-[#06D6A0] px-2 py-1 rounded border border-black">
                  Paid
                </span>
              </div>
              <div className="flex items-center justify-between rounded border border-black p-2 bg-[#f8f8f8]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FFD166]" />
                  <span className="font-medium">Maria Garcia</span>
                </div>
                <span className="text-xs font-medium bg-[#FFD166] px-2 py-1 rounded border border-black">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between rounded border border-black p-2 bg-[#f8f8f8]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FF5757]" />
                  <span className="font-medium">Alex Smith</span>
                </div>
                <span className="text-xs font-medium bg-[#FF5757] px-2 py-1 rounded border border-black">
                  Not Sent
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full border-2 border-black hover:bg-gray-100">
              View All Payments
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TabsContent>
  );
};
