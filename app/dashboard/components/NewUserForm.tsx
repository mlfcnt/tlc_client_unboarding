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
import {useToast} from "@/hooks/use-toast";
import {redirect} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useQueryClient} from "@tanstack/react-query";
import Page from "@/app/components/Page";

export const NewUserForm = () => {
  const {toast} = useToast();
  const {user} = useUser();
  const queryClient = useQueryClient();
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
    phoneNumber: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      idNumber: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {status} = await supabase.from("onboarding_requests").insert({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      id_number: +values.idNumber,
      sales_email: user?.emailAddresses[0].emailAddress,
      phone_number: values.phoneNumber,
    });

    queryClient.invalidateQueries({
      queryKey: ["onboardingRequests"],
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
      redirect("/dashboard");
    }
  };

  return (
    <Page title="New User">
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
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
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
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} />
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
    </Page>
  );
};
