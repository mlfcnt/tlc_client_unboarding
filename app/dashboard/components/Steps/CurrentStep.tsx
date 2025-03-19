import {Card} from "@/components/ui/card";
import React from "react";
import {processSteps} from "./processSteps";
import {getUsersAtStep} from "./lib";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {ArrowRight, UserCircle, Users} from "lucide-react";

export const CurrentStep = ({expandedStep}: {expandedStep: number | null}) => {
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
                      <AvatarFallback className="bg-orange-300">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{user.name}</div>
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
  );
};
