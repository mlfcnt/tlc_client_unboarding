import React from "react";
import {ActionCard} from "../ActionCard";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {useState} from "react";
import {NewLeadForm} from "./NewLeadForm";

export const Step1 = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
          actionName="Create a lead"
          onClick={() => {
            setOpen(true);
          }}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Create a lead</DialogTitle>
          <div className="grid gap-4 py-4">
            <NewLeadForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
