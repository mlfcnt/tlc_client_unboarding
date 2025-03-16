"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase";
import {InputOTPSlot} from "@/components/ui/input-otp";
import {InputOTP, InputOTPGroup} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {useToast} from "@/hooks/use-toast";
export const TestingRequest = () => {
  const {toast} = useToast();

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    idNumber: z.string().min(4, {
      message: "ID number must be at least 4 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      idNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {status} = await supabase.from("onboarding_requests").insert({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      id_number: +values.idNumber,
      status: "test_requested",
    });

    if (status !== 201) {
      toast({
        title: "Error",
        description: "Failed to save the request",
      });
    } else {
      toast({
        title: "Success",
        description: "Request saved successfully",
        className: "bg-green-500",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 font-bold max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({field}) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
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
              <FormLabel>Last name</FormLabel>
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
          name="idNumber"
          render={({field}) => (
            <FormItem>
              <FormLabel>ID number</FormLabel>
              <FormControl className="flex gap-2">
                <InputOTP
                  maxLength={10}
                  {...field}
                  value={field.value?.toString()}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <div className="flex flex-wrap gap-5">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                      <InputOTPSlot index={8} />
                      <InputOTPSlot index={9} />
                    </InputOTPGroup>
                  </div>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="cursor-pointer">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
