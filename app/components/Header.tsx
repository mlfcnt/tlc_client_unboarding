"use client";

import {Card} from "@/components/ui/card";
import {useUser} from "@clerk/nextjs";
import {UserButton} from "@clerk/nextjs";
import Image from "next/image";
import {redirect} from "next/navigation";

export default function Header() {
  const {user} = useUser();

  return (
    // use the css variable blank for the background color
    <Card className="mfixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 m500:h-16 ">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Image
            src="/logo.png"
            alt="TLC Logo"
            width={32}
            height={32}
            className="sm:w-[40px] sm:h-[40px]"
            priority
          />
          <span
            className="font-semibold text-lg sm:text-xl cursor-pointer"
            onClick={() => {
              redirect("/role-pending");
            }}
          >
            TLC Onboarding
          </span>
        </div>
        {user ? (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-gray-600 text-sm sm:text-base hidden sm:inline">
              Hola {user?.firstName} :)
            </span>
            <UserButton />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
