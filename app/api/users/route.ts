import {NextResponse} from "next/server";
import {clerkClient as clerk} from "@clerk/nextjs/server";

export async function GET() {
  const clerkClient = await clerk();
  const users = await clerkClient.users.getUserList();
  return NextResponse.json(users.data);
}
