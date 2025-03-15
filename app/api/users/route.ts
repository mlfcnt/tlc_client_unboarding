import {auth, clerkClient as clerk} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import type {User} from "@clerk/nextjs/server";

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

    // Get all users
    const {data: users} = await clerkClient.users.getUserList();

    // Map users to include only necessary information
    const mappedUsers = users.map((user: User) => ({
      id: user.id,
      emailAddresses: user.emailAddresses,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.publicMetadata?.role || "pending",
    }));

    return NextResponse.json({users: mappedUsers});
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function PUT(request: Request) {
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

    if (!["admin", "sales", "pending"].includes(role)) {
      return NextResponse.json({error: "Invalid role"}, {status: 400});
    }

    // Update user's role - if pending, clear the role
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: {role: role === "pending" ? "" : role},
    });

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
