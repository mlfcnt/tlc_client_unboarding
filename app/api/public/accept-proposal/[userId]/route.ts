import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabase";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {DATABASE_TABLES} from "@/app/constants/databaseTables";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(request: NextRequest, {params}: RouteContext) {
  try {
    const {userId} = await params;
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");

    if (!userId) {
      return NextResponse.json({error: "User ID is required"}, {status: 400});
    }

    // Update the status in Supabase
    const {error} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .update({
        status: getKeyFromValue(OnboardingStatuses.class_confirmed),
        start_date: startDate,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error accepting proposal:", error);
      return NextResponse.json(
        {error: "Failed to accept proposal"},
        {status: 500}
      );
    }

    // Redirect to a success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/proposal-accepted`
    );
  } catch (error) {
    console.error("Error processing acceptance:", error);
    return NextResponse.json(
      {error: "An unexpected error occurred: " + JSON.stringify(error)},
      {status: 500}
    );
  }
}
