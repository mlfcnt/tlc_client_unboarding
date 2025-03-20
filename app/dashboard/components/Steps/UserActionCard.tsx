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
import {Mail, MoreHorizontal, ScanEye} from "lucide-react";
import {UserDetailsCard} from "./UserDetailsCard";
import {SendTestForm} from "./StepsActions/Step2/SendTestForm";

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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
