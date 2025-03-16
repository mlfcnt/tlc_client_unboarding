"use client";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import {redirect} from "next/navigation";
import React from "react";

export const ShowAllBtn = ({
  href,
  title = "See all",
}: {
  href: string;
  title?: string;
}) => {
  return (
    <Button
      className="w-full border-2 border-black hover:bg-gray-100"
      onClick={() => {
        redirect(href);
      }}
    >
      {title}
      <ChevronRight className="ml-auto h-4 w-4" />
    </Button>
  );
};
