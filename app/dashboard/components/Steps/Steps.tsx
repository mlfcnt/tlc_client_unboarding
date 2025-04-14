import React, {useState, useEffect} from "react";
import {processSteps, ProcessStep} from "./processSteps";
import {CurrentStep} from "./CurrentStep";
import {StepCard} from "./StepCard";
import {ArrowRight, ArrowDown, LayoutGrid, LayoutList} from "lucide-react";
import {StepLegend} from "./StepLegend";
import {useUsersAtStep} from "../../api/useUsersPerStep";
import {useUser} from "@clerk/nextjs";
import {toast} from "sonner";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";

export const Steps = () => {
  const {user} = useUser();
  const {getUsersAtStep} = useUsersAtStep();
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [isVerticalLayout, setIsVerticalLayout] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Load layout preference from localStorage on initial render
  useEffect(() => {
    const savedLayout = localStorage.getItem("layoutPreference");
    if (savedLayout !== null) {
      setIsVerticalLayout(savedLayout === "vertical");
    }
  }, []);

  // Handle layout change with animation
  const handleLayoutChange = (newValue: boolean) => {
    setIsAnimating(true);
    setIsVerticalLayout(newValue);
    // Save preference to localStorage
    localStorage.setItem(
      "layoutPreference",
      newValue ? "vertical" : "horizontal"
    );
    // Animation duration matches the CSS transition duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

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
      <div className="absolute left-1/2 top-[45px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500">
        <ArrowRight strokeWidth={3} className="w-8 h-8 text-black" />
      </div>
    </td>
  );

  // Create a reusable down arrow component for vertical layout
  const DownArrowElement = () => (
    <div className="h-3 relative flex items-center justify-center my-1">
      <div className="w-[1px] h-full bg-black"></div>
    </div>
  );

  // Create a special version of StepCard for vertical layout
  const VerticalStepCard = ({
    step,
    handleStepClick,
    amountOfUsersAtThisStep,
    isSelected,
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
        className="relative cursor-pointer transition-all w-[150px]"
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
              "absolute top-[-8px] left-[8px] w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center"
            )}
          >
            <span className="text-sm text-white font-bold">{step.id}</span>
          </div>

          {/* User count circle */}
          <div
            className={cn(
              "absolute bottom-[-8px] right-[8px] rounded-full border-2 border-black flex items-center justify-center",
              amountOfUsersAtThisStep === 0 ? "w-6 h-6" : "w-9 h-9",
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

  const renderHorizontalLayout = () => (
    <div
      className={cn(
        "transition-all duration-500 transform-gpu",
        isAnimating && !isVerticalLayout
          ? "scale-100 opacity-100"
          : isAnimating && isVerticalLayout
          ? "scale-90 opacity-0"
          : ""
      )}
    >
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
    </div>
  );

  const renderVerticalLayout = () => (
    <div className="h-full">
      <div className="space-y-5 overflow-y-auto max-h-[75vh] pr-2">
        {processSteps.map((step, index) => {
          const usersAtThisStep = getUsersAtStep(step.id);
          return (
            <div key={step.id} className="flex items-center flex-col">
              <VerticalStepCard
                step={step}
                handleStepClick={handleStepClick}
                amountOfUsersAtThisStep={usersAtThisStep.length}
                isSelected={expandedStep === step.id}
              />
            </div>
          );
        })}
        <div className="h-4"></div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Layout Toggle */}
      <div className="flex justify-end items-center gap-3 mb-4 pr-4">
        <span className="text-sm font-medium mr-2">Layout:</span>
        <LayoutGrid
          size={18}
          className={
            !isVerticalLayout ? "text-primary" : "text-muted-foreground"
          }
        />
        <Switch
          checked={isVerticalLayout}
          onCheckedChange={handleLayoutChange}
          id="layout-toggle"
        />
        <LayoutList
          size={18}
          className={
            isVerticalLayout ? "text-primary" : "text-muted-foreground"
          }
        />
      </div>

      {/* Layout container */}
      {isVerticalLayout ? (
        <div className="flex flex-row gap-8">
          <div className="w-[180px] min-w-[180px] ml-2">
            {renderVerticalLayout()}
          </div>
          <div className="flex-1">
            <CurrentStep expandedStep={expandedStep} />
          </div>
        </div>
      ) : (
        <div>
          <div className="relative">
            <div className="w-full">{renderHorizontalLayout()}</div>
          </div>

          {/* Legend */}
          <StepLegend />

          {/* Current step details */}
          <CurrentStep expandedStep={expandedStep} />
        </div>
      )}
    </div>
  );
};
