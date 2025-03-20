"use client";

import React from "react";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormMessage} from "@/components/ui/form";
import {FormLabel, FormItem} from "@/components/ui/form";
import {FormField} from "@/components/ui/form";
import {successToast} from "@/components/Toasts/successToast";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {LEVELS} from "@/app/constants/levels";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {supabase} from "@/lib/supabase";
import {useUser} from "@clerk/nextjs";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {errorToast} from "@/components/Toasts/errorToast";
import {useQueryClient} from "@tanstack/react-query";
import {REACT_QUERY_KEYS} from "@/app/constants/reactQueryKeys";
import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {Textarea} from "@/components/ui/textarea";

export const NewLeadForm = ({onSuccess}: {onSuccess: () => void}) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const formSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(10).max(15),
    idNumber: z.string().min(4).max(13),
    skipTest: z.boolean().default(false),
    level: z.enum(["A1", "A2", "A2+", "B1", "B1+", "B2", "B2+", "C1"]),
    leadRemarks: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      idNumber: "",
      skipTest: false,
      level: "A1",
      leadRemarks: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const {
      firstName,
      lastName,
      phoneNumber: phone,
      idNumber,
      skipTest,
      level,
      email,
      leadRemarks,
    } = data;
    const {error} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        id_number: idNumber,
        sales_email: user.user?.emailAddresses[0].emailAddress,
        level,
        phone_number: phone,
        status: skipTest
          ? getKeyFromValue(OnboardingStatuses.test_completed)
          : getKeyFromValue(OnboardingStatuses.lead_created),
        lead_remarks: leadRemarks,
      });

    if (error) {
      errorToast(error.message);
    } else {
      successToast("Lead created successfully");
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ONBOARDING_REQUESTS],
      });
      form.reset();
      onSuccess();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({field}) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({field}) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNumber"
          render={({field}) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  pattern="\d*"
                  inputMode="numeric"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leadRemarks"
          render={({field}) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skipTest"
          render={({field}) => (
            <FormItem>
              <FormLabel>Skip test?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("skipTest") === true && (
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
        )}

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
  );
};
