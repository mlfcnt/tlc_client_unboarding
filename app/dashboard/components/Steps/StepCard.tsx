import {cn} from "@/lib/utils";
import React from "react";
import {ProcessStep} from "./processSteps";
import {CircleCheck, UserCircle, Users} from "lucide-react";

export const StepCard = ({
  step,
  handleStepClick,
  amountOfUsersAtThisStep,
  isSelected = false,
}: {
  step: ProcessStep;
  handleStepClick: (stepId: number) => void;
  amountOfUsersAtThisStep: number;
  isSelected?: boolean;
}) => {
  // Function to determine the color based on user count
  const getUserCountColor = () => {
    if (amountOfUsersAtThisStep === 0) return "text-gray-400";
    if (amountOfUsersAtThisStep <= 2) return "text-green-600 font-semibold";
    if (amountOfUsersAtThisStep <= 4) return "text-orange-500 font-semibold";
    return "text-red-600 font-bold";
  };

  return (
    <div
      key={step.id}
      className="relative cursor-pointer transition-all w-[150px]"
      onClick={() => handleStepClick(step.id)}
    >
      <div
        className={cn(
          "h-20 w-full flex flex-col items-center justify-center rounded-lg border-4 border-black font-bold relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2",
          isSelected ? "bg-white" : "bg-gray-200"
        )}
      >
        <div className="text-sm font-bold text-center leading-tight max-h-14 overflow-hidden">
          {step.name}
        </div>

        <div
          className={cn(
            "absolute -top-2 -left-2 w-7 h-7 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center"
          )}
        >
          <span className="text-xs text-white font-bold">{step.id}</span>
        </div>

        <div
          className={cn(
            "absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-2 border-black",
            step.owner === "sales" ? "bg-blue-500" : "bg-purple-500"
          )}
        >
          {step.owner === "sales" ? (
            <UserCircle className="w-full h-full text-white" />
          ) : step.owner === "admin" ? (
            <Users className="w-full h-full text-white" />
          ) : (
            <CircleCheck className="w-full h-full text-white" />
          )}
        </div>
      </div>

      {/* User count below the card */}
      <div className={cn("mt-2 text-center font-medium", getUserCountColor())}>
        {amountOfUsersAtThisStep > 0
          ? `${amountOfUsersAtThisStep} user${
              amountOfUsersAtThisStep > 1 ? "s" : ""
            }`
          : "No users"}
      </div>
    </div>
  );
};
