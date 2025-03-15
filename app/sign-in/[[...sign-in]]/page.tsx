import {SignIn} from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
