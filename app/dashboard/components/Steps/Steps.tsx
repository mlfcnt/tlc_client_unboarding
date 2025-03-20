import React, {useState} from "react";
import {processSteps} from "./processSteps";
import {CurrentStep} from "./CurrentStep";
import {StepCard} from "./StepCard";
import {ArrowRight} from "lucide-react";
import {StepLegend} from "./StepLegend";
import {useUsersAtStep} from "../../api/useUsersPerStep";
import {useUser} from "@clerk/nextjs";
import {toast} from "sonner";

export const Steps = () => {
  const {user} = useUser();
  const {getUsersAtStep} = useUsersAtStep();
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const handleStepClick = (stepId: number) => {
    const step = processSteps.find((step) => step.id === stepId)!;
    if (step.owner === "admin" && user?.publicMetadata.role !== "admin") {
      toast.error("This step is only available for admins");
      return;
    }
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
      <StepLegend />

      {/* Current step details */}
      <CurrentStep expandedStep={expandedStep} />
    </div>
  );
};
