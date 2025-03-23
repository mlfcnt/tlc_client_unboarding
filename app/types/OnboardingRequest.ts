import {LEVELS} from "../constants/levels";
import {OnboardingStatuses} from "../constants/OnboardingStatuses";

export type OnboardingRequest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  id_number: number;
  created_at: string;
  updated_at: string;
  lead_remarks?: string;
  sales_email: string;
  level: keyof typeof LEVELS;
  start_date: Date;
  phone_number: string;
  status: keyof typeof OnboardingStatuses;
  group_refused_reason: string;
  contract_request_notes: string;
};
