import {Card} from "@/components/ui/card";
import React from "react";
import {processSteps} from "./processSteps";
import {useUsersAtStep} from "../../api/useUsersPerStep";
import {UserActionCard} from "./UserActionCard";
import {Step1} from "./StepsActions/Step1/Step1";

export const CurrentStep = ({expandedStep}: {expandedStep: number | null}) => {
  const {getUsersAtStep} = useUsersAtStep();
  const usersAtStep = getUsersAtStep(expandedStep);

  if (!expandedStep) return null;
  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg] overflow-visible">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black">
            Step {processSteps[expandedStep - 1].id}:{" "}
            {processSteps[expandedStep - 1].name}
          </h2>
        </div>

        {expandedStep === 1 ? null : (
          <p className="text-lg mb-6 bg-yellow-100 p-3 border-2 border-black">
            {processSteps[expandedStep - 1].description}
          </p>
        )}

        {expandedStep === 1 ? (
          <Step1 />
        ) : (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Students at this step:</h3>
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {usersAtStep.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {usersAtStep.map((user) => {
                    return (
                      <UserActionCard
                        key={user.id}
                        userId={user.id}
                        currentStep={expandedStep}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-2 italic">
                  No students currently at this step
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
