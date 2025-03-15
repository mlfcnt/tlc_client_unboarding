import {auth, clerkClient as clerk} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;

    // Check if user is authenticated and is an admin
    if (!userId) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const clerkClient = await clerk();

    if (!clerkClient) {
      return NextResponse.json(
        {error: "Server configuration error"},
        {status: 500}
      );
    }

    const currentUser = await clerkClient.users.getUser(userId);
    if (currentUser.publicMetadata?.role !== "admin") {
      return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    // Get all users without a role
    const users = await clerkClient.users.getUserList({
      query: "publicMetadata.role:null OR publicMetadata.role:''",
    });

    return NextResponse.json({users});
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session.userId;

    // Check if user is authenticated and is an admin
    if (!userId) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const clerkClient = await clerk();
    if (!clerkClient) {
      return NextResponse.json(
        {error: "Server configuration error"},
        {status: 500}
      );
    }

    const currentUser = await clerkClient.users.getUser(userId);
    if (currentUser.publicMetadata?.role !== "admin") {
      return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    const {targetUserId, role} = await request.json();

    if (!targetUserId || !role) {
      return NextResponse.json(
        {error: "Missing required fields"},
        {status: 400}
      );
    }

    if (!["admin", "sales"].includes(role)) {
      return NextResponse.json({error: "Invalid role"}, {status: 400});
    }

    // Update user's role
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: {role},
    });

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
