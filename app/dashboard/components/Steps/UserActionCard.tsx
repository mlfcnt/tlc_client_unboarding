import React, {useState} from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {useUserRequest} from "../../api/useUserRequest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {FileText, Mail, MoreHorizontal, ScanEye} from "lucide-react";
import {UserDetailsCard} from "./UserDetailsCard";
import {SendTestForm} from "./StepsActions/Step2/SendTestForm";
import {NotifyAlert} from "./StepsActions/Step3/NotifyAlert";
import {ProposeGroupForm} from "./StepsActions/Step4/ProposeGroupForm";
import {ContractRequestForm} from "./StepsActions/Step6/ContractRequestForm";
import {SendContractForm} from "./StepsActions/Step8/SendContractForm";

export const UserActionCard = ({
  userId,
  currentStep,
}: {
  userId: OnboardingRequest["id"];
  currentStep: number;
}) => {
  const {data: user} = useUserRequest(userId);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSendTest, setShowSendTest] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifyAlert, setShowNotifyAlert] = useState(false);
  const [showProposeGroup, setShowProposeGroup] = useState(false);
  const [showContractRequest, setShowContractRequest] = useState(false);
  const [showSendContract, setShowSendContract] = useState(false);

  return (
    <>
      {/* User Details Modal */}
      <UserDetailsCard
        user={user}
        show={showUserDetails}
        setShow={setShowUserDetails}
      />

      {/* Send Test Modal */}
      {currentStep === 2 && (
        <SendTestForm
          user={user}
          show={showSendTest}
          setShow={setShowSendTest}
        />
      )}

      {currentStep === 3 && (
        <NotifyAlert
          userId={userId}
          show={showNotifyAlert}
          setShow={setShowNotifyAlert}
        />
      )}

      {currentStep === 4 && (
        <ProposeGroupForm
          user={user}
          show={showProposeGroup}
          setShow={setShowProposeGroup}
        />
      )}

      {/* Contract Request Form */}
      {currentStep === 6 && (
        <ContractRequestForm
          user={user}
          show={showContractRequest}
          setShow={setShowContractRequest}
        />
      )}

      {currentStep === 7 && (
        <ProposeGroupForm
          user={user}
          show={showProposeGroup}
          setShow={setShowProposeGroup}
          showRefusedReason
        />
      )}

      {currentStep === 8 && (
        <SendContractForm
          user={user}
          show={showSendContract}
          setShow={setShowSendContract}
        />
      )}

      <div
        key={userId}
        className="flex items-center gap-3 p-2 rounded border-2 border-black bg-orange-100"
      >
        <Avatar className="h-10 w-10 border-2 border-black">
          <AvatarFallback className="bg-orange-300">
            {user.first_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold">
            {user.first_name} {user.last_name}
          </div>
        </div>
        <div className="ml-auto">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div
                className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                onClick={() => {
                  setShowUserDetails(true);
                  setDropdownOpen(false);
                }}
              >
                <ScanEye className="mr-2 h-4 w-4" /> View user details
              </div>
              {currentStep === 2 && (
                <div
                  className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                  onClick={() => {
                    setShowSendTest(true);
                    setDropdownOpen(false);
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> Send the test via email
                </div>
              )}
              {currentStep === 3 && (
                <div
                  className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                  onClick={() => {
                    setShowNotifyAlert(true);
                    setDropdownOpen(false);
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  The user has completed the test
                </div>
              )}
              {currentStep === 4 && (
                <div
                  className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                  onClick={() => {
                    setShowProposeGroup(true);
                    setDropdownOpen(false);
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> Propose a group
                </div>
              )}
              {currentStep === 6 && (
                <div
                  className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                  onClick={() => {
                    setShowContractRequest(true);
                    setDropdownOpen(false);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" /> Request a contract
                </div>
              )}
              {currentStep === 7 && (
                <div
                  className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                  onClick={() => {
                    setShowProposeGroup(true);
                    setDropdownOpen(false);
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> Propose a new group
                </div>
              )}
              {currentStep === 8 && (
                <div
                  className="p-2 cursor-pointer hover:bg-slate-100 rounded flex items-center"
                  onClick={() => {
                    setShowSendContract(true);
                    setDropdownOpen(false);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" /> Send contract
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
