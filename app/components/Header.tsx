"use client";

import {Card} from "@/components/ui/card";
import {useUser} from "@clerk/nextjs";
import {UserButton} from "@clerk/nextjs";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Header() {
  const router = useRouter();
  const {user} = useUser();

  return (
    // use the css variable blank for the background color
    <Card className="mfixed left-0 top-0 z-20 mx-auto flex h-[60px] w-full items-center justify-between border-b-4 border-border dark:border-darkNavBorder bg-accent dark:bg-secondaryBlack px-5 m500:h-14">
      <div className="w-full flex items-center justify-between h-full">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11">
            <Image
              src="/logo.png"
              alt="TLC Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <span
            className="font-semibold text-base sm:text-lg cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            TLC Onboarding
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-600 dark:text-gray-300 text-sm hidden sm:inline">
                Hola {user?.firstName}
              </span>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
