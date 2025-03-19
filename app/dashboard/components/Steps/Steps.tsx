import React, {useState} from "react";
import {processSteps} from "./processSteps";
import {getUsersAtStep} from "./lib";
import {CurrentStep} from "./CurrentStep";
import {StepCard} from "./StepCard";
import {ArrowRight} from "lucide-react";

export const Steps = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const handleStepClick = (stepId: number) => {
    setExpandedStep(stepId);
  };

  // Split the steps into two rows
  const firstRowSteps = processSteps.slice(0, 6);
  const secondRowSteps = processSteps.slice(6);

  // Create a reusable arrow component
  const ArrowElement = () => (
    <td
      className="w-10 align-middle relative"
      style={{verticalAlign: "middle"}}
    >
      <div className="absolute left-1/2 top-[45px] -translate-x-1/2 -translate-y-1/2">
        <ArrowRight strokeWidth={3} className="w-8 h-8 text-black" />
      </div>
    </td>
  );

  return (
    <div className="space-y-4">
      {/* First row */}
      <div className="flex justify-center mb-2">
        <table className="border-separate border-spacing-x-2">
          <tbody>
            <tr>
              {firstRowSteps.map((step, index) => {
                const usersAtThisStep = getUsersAtStep(step.id);
                return (
                  <React.Fragment key={step.id}>
                    <td className="px-0 pb-2">
                      <StepCard
                        step={step}
                        handleStepClick={handleStepClick}
                        amountOfUsersAtThisStep={usersAtThisStep.length}
                        isSelected={expandedStep === step.id}
                      />
                    </td>
                    {index < firstRowSteps.length - 1 && <ArrowElement />}
                  </React.Fragment>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Second row */}
      <div className="flex justify-center mb-6">
        <table className="border-separate border-spacing-x-2">
          <tbody>
            <tr>
              {secondRowSteps.map((step, index) => {
                const usersAtThisStep = getUsersAtStep(step.id);
                return (
                  <React.Fragment key={step.id}>
                    <td className="px-0 pb-2">
                      <StepCard
                        step={step}
                        handleStepClick={handleStepClick}
                        amountOfUsersAtThisStep={usersAtThisStep.length}
                        isSelected={expandedStep === step.id}
                      />
                    </td>
                    {index < secondRowSteps.length - 1 && <ArrowElement />}
                  </React.Fragment>
                );
              })}
            </tr>
          </tbody>
        </table>
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
