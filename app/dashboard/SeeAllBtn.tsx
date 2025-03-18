"use client";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import React from "react";

const SeeMoreBtn = ({
  href,
  title = "See all",
}: {
  href: string;
  title?: string;
}) => {
  const router = useRouter();
  return (
    <Button
      variant="neutral"
      className="cursor-pointer"
      onClick={() => {
        router.push(href);
      }}
    >
      {title}
    </Button>
  );
};

export default SeeMoreBtn;
