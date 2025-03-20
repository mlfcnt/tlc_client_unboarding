import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Mail, ScanEye} from "lucide-react";
import React from "react";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {UserDetailsCard} from "../UserDetailsCard";
import {SendTestForm} from "./Step2/SendTestForm";

// Define modal types
type ModalType = "userDetails" | "sendTest" | null;

export const ActionsPerStep = ({
  user,
  currentStep,
  activeModal,
  onModalChange,
}: {
  user: OnboardingRequest;
  currentStep: number;
  activeModal: ModalType;
  onModalChange: (modal: ModalType) => void;
}) => {
  return (
    <>
      <UserDetailsCard
        user={user}
        show={activeModal === "userDetails"}
        setShow={(show) => onModalChange(show ? "userDetails" : null)}
      />
      <SendTestForm
        user={user}
        show={activeModal === "sendTest"}
        setShow={(show) => onModalChange(show ? "sendTest" : null)}
      />
      <DropdownMenuItem
        onClick={() => {
          onModalChange("userDetails");
        }}
      >
        <ScanEye className="mr-2 h-4 w-4" />
        View user details
      </DropdownMenuItem>
      {currentStep === 2 && (
        <DropdownMenuItem
          onClick={() => {
            onModalChange("sendTest");
          }}
        >
          <Mail className="mr-2 h-4 w-4" />
          Send the test via email
        </DropdownMenuItem>
      )}
    </>
  );
};
