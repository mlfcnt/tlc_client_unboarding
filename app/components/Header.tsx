"use client";

import {useUser} from "@clerk/nextjs";
import {UserButton} from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  const {user} = useUser();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="TLC Logo"
            width={40}
            height={40}
            priority
          />
          <span className="font-semibold text-xl">TLC Onboarding</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {user?.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}
