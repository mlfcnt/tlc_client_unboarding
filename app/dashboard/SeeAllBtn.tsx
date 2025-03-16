"use client";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";
import React from "react";

const SeeMoreBtn = ({
  href,
  title = "See all",
}: {
  href: string;
  title?: string;
}) => {
  return (
    <Button
      variant="neutral"
      className="cursor-pointer"
      onClick={() => {
        redirect(href);
      }}
    >
      {title}
    </Button>
  );
};

export default SeeMoreBtn;
