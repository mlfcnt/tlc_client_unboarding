"use client";

import React, {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {useUpdateStatusAndInvalidateCache} from "@/app/dashboard/api/updateStatus";
import {supabase} from "@/lib/supabase";
import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {DriveUploader} from "./DriveUploader";

export const ContractRequestForm = ({
  user,
  show,
  setShow,
}: {
  user: OnboardingRequest;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const {updateStatus} = useUpdateStatusAndInvalidateCache();
  const [uploadedFileLinks, setUploadedFileLinks] = useState<string[]>([]);

  const formSchema = z.object({
    additionalInformation: z.string().optional(),
    confirmContractRequest: z.boolean().refine((val) => val === true, {
      message: "You must confirm before requesting a contract",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalInformation: "",
      confirmContractRequest: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Check if at least one file has been uploaded
      if (uploadedFileLinks.length === 0) {
        toast.error("Please upload at least one document");
        return;
      }

      // First update additional information if provided
      if (data.additionalInformation) {
        const {error: updateError} = await supabase
          .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
          .update({
            contract_request_notes: data.additionalInformation,
          })
          .eq("id", user.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      // Then update the status
      await updateStatus({
        newStatus: getKeyFromValue(OnboardingStatuses.contract_requested),
        userId: user.id,
      });

      toast.success("Contract requested successfully");
      setShow(false);
      form.reset();
      setUploadedFileLinks([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to request contract");
    }
  };

  // Handler for when file uploads change
  const handleUploadsChanged = (fileLinks: string[]) => {
    setUploadedFileLinks(fileLinks);
  };

  return (
    <Dialog
      open={show}
      onOpenChange={() => {
        setShow(false);
        form.reset();
        setUploadedFileLinks([]);
      }}
    >
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black">
            Request a contract for {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Document uploader */}
            <div className="space-y-2">
              <FormLabel>Upload Documents</FormLabel>
              <DriveUploader
                user={user}
                onUploadsChanged={handleUploadsChanged}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalInformation"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Additional information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional information required for the contract..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmContractRequest"
              render={({field}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I confirm that all information is correct and I am ready
                      to request a contract
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || uploadedFileLinks.length === 0
                }
                className="cursor-pointer hover:bg-green-900 bg-green-600 text-white"
              >
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : "Request Contract"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
