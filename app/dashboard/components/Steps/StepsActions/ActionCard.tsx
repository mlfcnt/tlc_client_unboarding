import React from "react";

export const ActionCard = ({
  actionName,
  onClick,
}: {
  actionName: string;
  onClick: () => void;
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div
        className="bg-blue-100 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg] cursor-pointer hover:bg-blue-200 transition-colors duration-300"
        onClick={onClick}
      >
        <h3 className="text-2xl font-bold flex items-center justify-center">
          {actionName}
        </h3>

        {/* <ul className="space-y-2">
          <li className="flex items-center">
            <ArrowRight className="mr-2 flex-shrink-0" />
            <span>{actionName}</span>
          </li>
        </ul> */}
      </div>
    </div>
  );
};
