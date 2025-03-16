import {NextResponse} from "next/server";
import {clerkClient as clerk} from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  props: {params: Promise<{id: string}>}
) {
  const params = await props.params;
  const clerkClient = await clerk();
  const {id} = params;
  const {role} = await req.json();

  await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      role: role === "none" ? null : role,
    },
  });

  return NextResponse.json({message: "User role updated"});
}
