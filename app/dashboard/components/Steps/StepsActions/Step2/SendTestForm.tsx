import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {useUpdateStatus} from "@/app/dashboard/api/updateStatus";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {Button} from "@/components/ui/button";
import {DialogTitle} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import React from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";

export const SendTestForm = ({
  user,
  show,
  setShow,
}: {
  user: OnboardingRequest;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const {updateStatus} = useUpdateStatus();
  const formSchema = z.object({
    email: z.string().email(),
    testLink: z.string().url(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      testLink: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/testing", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to send test");
      }
      toast.success("Test sent successfully");

      await updateStatus({
        newStatus: getKeyFromValue(OnboardingStatuses.test_sent),
        userId: user.id,
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send test");
    }
  };
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black">
            Send the test to {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>User email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testLink"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Link to the test</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="cursor-pointer hover:bg-green-900 bg-green-600 text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
