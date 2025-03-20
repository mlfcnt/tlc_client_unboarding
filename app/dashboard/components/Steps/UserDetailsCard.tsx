import {Button} from "@/components/ui/button";
import {DialogFooter} from "@/components/ui/dialog";
import {DialogContent, DialogTitle, DialogHeader} from "@/components/ui/dialog";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {Dialog} from "@/components/ui/dialog";
import React from "react";

export const UserDetailsCard = ({
  user,
  show,
  setShow,
}: {
  user: OnboardingRequest;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const formatDate = (date: string | Date | null) => {
    if (!date || new Date(date).getTime() === 0) return "Not yet defined";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black">
            {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          {/* Onboarding Information */}
          <div className="bg-green-100 p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-3">Onboarding Information</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              <div>
                <div className="font-bold">Level:</div>
                <div>{user.level}</div>
              </div>
              <div>
                <div className="font-bold">Status:</div>
                <div className="capitalize">
                  {user.status.replace(/_/g, " ")}
                </div>
              </div>
              <div>
                <div className="font-bold">Start Date:</div>
                <div>{formatDate(user.start_date)}</div>
              </div>
            </div>
            {user.lead_remarks && (
              <div className="mt-6 pt-6 border-t-2 border-black">
                <div className="font-bold">Remarks:</div>
                <div className="whitespace-pre-wrap mt-1">
                  {user.lead_remarks}
                </div>
              </div>
            )}
          </div>
          {/* Contact Information */}
          <div className="bg-yellow-100 p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              <div>
                <div className="font-bold">First Name:</div>
                <div className="break-all">{user.first_name}</div>
              </div>
              <div>
                <div className="font-bold">Last Name:</div>
                <div className="break-all">{user.last_name}</div>
              </div>
              <div>
                <div className="font-bold">Email:</div>
                <div className="break-all">{user.email}</div>
              </div>
              <div>
                <div className="font-bold">Phone number:</div>
                <div>{user.phone_number}</div>
              </div>
              <div>
                <div className="font-bold">Lead created by:</div>
                <div className="break-all">{user.sales_email}</div>
              </div>
              <div>
                <div className="font-bold">ID Number:</div>
                <div>{user.id_number}</div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-pink-100 p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-3">Metadata</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              <div>
                <div className="font-bold">Created:</div>
                <div>{formatDate(user.created_at)}</div>
              </div>
              <div>
                <div className="font-bold">Last updated:</div>
                <div>{formatDate(user.updated_at)}</div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShow(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
