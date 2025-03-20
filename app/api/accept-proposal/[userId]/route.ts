import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabase";
import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";

// Function to convert dd/MM/yyyy format to ISO date for storage
const parseFormattedDate = (dateStr: string) => {
  try {
    // Parse dd/MM/yyyy format
    const [day, month, year] = dateStr.split("/").map(Number);

    // Create date in ISO format (YYYY-MM-DD)
    const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return isoDate;
  } catch (error) {
    console.error("Error parsing date:", dateStr, error);
    throw new Error(`Invalid date format: ${dateStr}`);
  }
};

export async function GET(
  request: NextRequest,
  props: {params: Promise<{userId: string}>}
) {
  const params = await props.params;
  try {
    const userId = params.userId;
    const url = new URL(request.url);
    const startDateFormatted = url.searchParams.get("startDate");
    const level = url.searchParams.get("level") as OnboardingRequest["level"];

    if (!userId) {
      return NextResponse.json({error: "User ID is required"}, {status: 400});
    }

    if (!startDateFormatted) {
      return NextResponse.json(
        {error: "Start date is required"},
        {status: 400}
      );
    }

    // Convert from dd/MM/yyyy to ISO format for storage
    const startDateIso = parseFormattedDate(startDateFormatted);

    // First, let's check if the record exists and what fields it has
    const {error: fetchError} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching test request:", fetchError);
      return NextResponse.json(
        {error: "Failed to fetch test request: " + JSON.stringify(fetchError)},
        {status: 500}
      );
    }

    // Prepare update data
    const updateData: {
      status: OnboardingRequest["status"];
      start_date: OnboardingRequest["start_date"];
      level: OnboardingRequest["level"];
    } = {
      status: getKeyFromValue(OnboardingStatuses.class_confirmed),
      start_date: startDateIso as unknown as Date,
      level,
    };

    // Update the status, start date, and level in Supabase
    const {error} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .update(updateData)
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error accepting proposal:", error);
      return NextResponse.json(
        {error: "Failed to accept proposal: " + JSON.stringify(error)},
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
