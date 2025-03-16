import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/hooks/use-toast";
import {useQueryClient} from "@tanstack/react-query";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {supabase} from "@/lib/supabase";
import {LEVELS} from "@/app/constants/levels";

export const SendLevelDialog = ({
  show,
  setShow,
  userInfo,
  adminEmail,
  requestId,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  userInfo: {
    email: string;
    firstname: string;
    lastname: string;
  };
  adminEmail: string;
  requestId: string;
}) => {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const formSchema = z.object({
    level: z.string({
      required_error: "Please select a level",
    }),
    startDate: z.date({
      required_error: "Please select a start date",
    }),
    feedback: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/send-level", {
        method: "POST",
        body: JSON.stringify({
          userEmail: userInfo.email,
          userFirstname: userInfo.firstname,
          userLastname: userInfo.lastname,
          adminEmail,
          startDate: values.startDate.toISOString(),
          level: values.level,
          additionalContent: values.feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send level information");
      }

      toast({
        title: "Success",
        description: "Level information sent successfully",
        className: "bg-green-500",
      });

      form.reset();

      setShow(false);
      await supabase
        .from("onboarding_requests")
        .update({
          status: getKeyFromValue(OnboardingStatuses.notified_level_sales),
          level: values.level,
          start_date: values.startDate.toISOString(),
        })
        .eq("id", requestId);
      queryClient.invalidateQueries({queryKey: ["onboardingRequests"]});
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Level information not sent",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Send level</DialogTitle>
          <DialogDescription>
            Send level and availability to sales
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="level"
              render={({field}) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Level</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(LEVELS).map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({field}) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-2">Start Date</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="border rounded-base"
                        modifiers={{
                          disabled: (date) => {
                            return date < new Date();
                          },
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({field}) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right pt-2">Feedback</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Textarea
                        placeholder="Add your feedback here (optional)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
