import {LEVELS} from "@/app/constants/levels";
import {useUpdateStatusAndInvalidateCache} from "@/app/dashboard/api/updateStatus";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
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
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import React from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {format, setDefaultOptions} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";

import {enGB} from "date-fns/locale";
import {Textarea} from "@/components/ui/textarea";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
setDefaultOptions({locale: enGB});

export const ProposeGroupForm = ({
  user,
  show,
  setShow,
}: {
  user: OnboardingRequest;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const {updateStatus} = useUpdateStatusAndInvalidateCache();
  const formSchema = z.object({
    level: z.enum(["A1", "A2", "A2+", "B1", "B1+", "B2", "B2+", "C1"]),
    startDate: z.date(),
    email: z.string().email(),
    additionalContent: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      level: user.level,
      startDate: undefined,
      additionalContent: "",
    },
  });

  const onSubmit = async ({
    email,
    level,
    startDate,
    additionalContent,
  }: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/send-level", {
        method: "POST",
        body: JSON.stringify({
          userEmail: email,
          userFirstname: user.first_name,
          userLastname: user.last_name,
          startDate: format(startDate, "PPPP"),
          level,
          additionalContent,
          userId: user.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send test");
      }
      toast.success("Email sent successfully");

      await updateStatus({
        newStatus: getKeyFromValue(OnboardingStatuses.class_proposed),
        userId: user.id,
      });
      setShow(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black">
            Propose a group to {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="level"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LEVELS).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalContent"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Additional content (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer hover:bg-green-900 bg-green-600 text-white"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
