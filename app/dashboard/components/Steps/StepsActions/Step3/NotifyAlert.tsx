import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {useUpdateStatusAndInvalidateCache} from "@/app/dashboard/api/updateStatus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

export const NotifyAlert = ({
  userId,
  show,
  setShow,
}: {
  userId: string;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const {updateStatus} = useUpdateStatusAndInvalidateCache();

  const onConfirm = async () => {
    await updateStatus({
      userId,
      newStatus: getKeyFromValue(OnboardingStatuses.test_completed),
    });
    setShow(false);
  };

  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you confirm that the user has completed the test?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShow(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
