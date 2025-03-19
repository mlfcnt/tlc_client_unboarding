import {cn} from "@/lib/utils";
import React from "react";
import {ProcessStep} from "./processSteps";

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
    if (amountOfUsersAtThisStep === 0) return "bg-gray-400";
    if (amountOfUsersAtThisStep <= 2) return "bg-green-600";
    if (amountOfUsersAtThisStep <= 4) return "bg-orange-500";
    return "bg-red-600";
  };

  // Function to determine the background color of the card based on owner
  const getCardBackgroundColor = () => {
    if (isSelected) return "bg-white";

    if (step.owner === "sales") return "bg-blue-100";
    if (step.owner === "admin") return "bg-purple-100";

    return "bg-gray-200";
  };

  return (
    <div
      key={step.id}
      className="relative cursor-pointer transition-all w-[160px]"
      onClick={() => handleStepClick(step.id)}
    >
      <div
        className={cn(
          "h-24 w-full flex flex-col items-center justify-center rounded-lg border-4 border-black font-bold relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3",
          getCardBackgroundColor()
        )}
      >
        <div className="text-lg font-bold text-center leading-tight max-h-16 overflow-hidden">
          {step.name}
        </div>

        {/* Step ID circle */}
        <div
          className={cn(
            "absolute -top-2 -left-2 w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center"
          )}
        >
          <span className="text-sm text-white font-bold">{step.id}</span>
        </div>

        {/* User count circle */}
        <div
          className={cn(
            "absolute -bottom-2 -right-2 w-9 h-9 rounded-full border-2 border-black flex items-center justify-center",
            getUserCountColor()
          )}
        >
          <span className="text-sm text-white font-bold">
            {amountOfUsersAtThisStep}
          </span>
        </div>
      </div>
    </div>
  );
};
