import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabase";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {DATABASE_TABLES} from "@/app/constants/databaseTables";

export async function POST(request: NextRequest) {
  try {
    const {userId, feedback} = await request.json();

    if (!userId || !feedback) {
      return NextResponse.json(
        {error: "User ID and feedback are required"},
        {status: 400}
      );
    }

    // Update the status and add feedback in Supabase
    const {error} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .update({
        status: getKeyFromValue(OnboardingStatuses.class_refused),
        group_refused_reason: feedback,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error rejecting proposal:", error);
      return NextResponse.json(
        {error: "Failed to reject proposal"},
        {status: 500}
      );
    }

    return NextResponse.json(
      {success: true, message: "Feedback received successfully"},
      {status: 200}
    );
  } catch (error) {
    console.error("Error processing rejection:", error);
    return NextResponse.json(
      {error: "An unexpected error occurred"},
      {status: 500}
    );
  }
}
