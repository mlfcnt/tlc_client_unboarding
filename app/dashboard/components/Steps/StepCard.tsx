import {cn} from "@/lib/utils";
import React from "react";
import {ProcessStep} from "./processSteps";
import {CircleCheck, UserCircle, Users} from "lucide-react";

export const StepCard = ({
  step,
  handleStepClick,
  amountOfUsersAtThisStep,
}: {
  step: ProcessStep;
  handleStepClick: (stepId: number) => void;
  amountOfUsersAtThisStep: number;
}) => {
  return (
    <div
      key={step.id}
      className={cn("relative cursor-pointer transition-all")}
      onClick={() => handleStepClick(step.id)}
    >
      <div
        className={cn(
          "h-16 flex flex-col items-center justify-center rounded-lg border-4 border-black font-bold relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          "bg-gray-200"
        )}
      >
        <span className="text-xl font-bold">{amountOfUsersAtThisStep}</span>

        <div
          className={cn(
            "absolute -top-2 -left-2 w-6 h-6 rounded-full border-2 border-black",
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

      <div className="mt-2 text-md font-medium text-center line-clamp-2 h-8">
        {step.name}
      </div>
    </div>
  );
};
