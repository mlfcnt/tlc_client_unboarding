import React, {useState} from "react";
import {processSteps} from "./processSteps";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {getUsersAtStep} from "./lib";
import {ArrowRight, CheckCircle, UserCircle, Users} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const Steps = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
            <div
              key={step.id}
              className={cn(
                "relative cursor-pointer transition-all",
                step.id === expandedStep ? "scale-105" : ""
              )}
              onClick={() => handleStepClick(step.id)}
            >
              <div
                className={cn(
                  "h-16 flex flex-col items-center justify-center rounded-lg border-4 border-black font-bold relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                  step.id < currentStep
                    ? "bg-green-300"
                    : step.id === currentStep
                    ? step.owner === "sales"
                      ? "bg-blue-300"
                      : "bg-purple-300"
                    : "bg-gray-200"
                )}
              >
                <div className="text-xl">{step.id}</div>
                <div className="text-xs font-normal">
                  {usersAtThisStep.length}
                </div>

                {step.id < currentStep && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full text-green-600" />
                )}

                <div
                  className={cn(
                    "absolute -top-2 -left-2 w-6 h-6 rounded-full border-2 border-black",
                    step.owner === "sales" ? "bg-blue-500" : "bg-purple-500"
                  )}
                >
                  {step.owner === "sales" ? (
                    <UserCircle className="w-full h-full text-white" />
                  ) : (
                    <Users className="w-full h-full text-white" />
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs font-medium text-center line-clamp-2 h-8">
                {step.name}
              </div>
            </div>
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
      {expandedStep && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg] overflow-visible">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black">
                Step {processSteps[expandedStep - 1].id}:{" "}
                {processSteps[expandedStep - 1].name}
              </h2>
              <Badge
                className={cn(
                  "text-white border-2 border-black px-3 py-1 text-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  processSteps[expandedStep - 1].owner === "sales"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                )}
              >
                {processSteps[expandedStep - 1].owner === "sales"
                  ? "Sales"
                  : "Admin"}
              </Badge>
            </div>

            <p className="text-lg mb-6 bg-yellow-100 p-3 border-2 border-black">
              {processSteps[expandedStep - 1].description}
            </p>

            {/* End users at this step */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Students at this step:</h3>
              <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {getUsersAtStep(expandedStep).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getUsersAtStep(expandedStep).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded border-2 border-black bg-orange-100"
                      >
                        <Avatar className="h-10 w-10 border-2 border-black">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-orange-300">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-xs">{user.course}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-2 italic">
                    No students currently at this step
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {processSteps[expandedStep - 1].salesActions.length > 0 && (
                <div className="bg-blue-100 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg]">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <UserCircle className="mr-2" /> Sales Actions
                  </h3>
                  <ul className="space-y-2">
                    {processSteps[expandedStep - 1].salesActions.map(
                      (action, index) => (
                        <li key={index} className="flex items-center">
                          <ArrowRight className="mr-2 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {processSteps[expandedStep - 1].adminActions.length > 0 && (
                <div className="bg-purple-100 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg]">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Users className="mr-2" /> Admin Actions
                  </h3>
                  <ul className="space-y-2">
                    {processSteps[expandedStep - 1].adminActions.map(
                      (action, index) => (
                        <li key={index} className="flex items-center">
                          <ArrowRight className="mr-2 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
