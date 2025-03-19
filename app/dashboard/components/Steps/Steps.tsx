import React, {useState} from "react";
import {processSteps} from "./processSteps";
import {getUsersAtStep} from "./lib";
import {CurrentStep} from "./CurrentStep";
import {StepCard} from "./StepCard";

export const Steps = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const handleStepClick = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="space-y-8">
      {/* Progress visualization */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-2 mb-8">
        {processSteps.map((step) => {
          const usersAtThisStep = getUsersAtStep(step.id);
          return (
            <StepCard
              key={step.id}
              step={step}
              handleStepClick={handleStepClick}
              amountOfUsersAtThisStep={usersAtThisStep.length}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-black"></div>
          <span className="font-bold">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-black"></div>
          <span className="font-bold">Admin</span>
        </div>
      </div>

      {/* Current step details */}
      <CurrentStep expandedStep={expandedStep} />
    </div>
  );
};
