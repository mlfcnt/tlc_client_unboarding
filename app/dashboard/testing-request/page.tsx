import Page from "@/app/components/Page";
import React from "react";
import {TestingRequest} from "../components/TestingRequest";

export default function TestingRequestPage() {
  return (
    <Page title="Test request" className="max-w-md">
      <TestingRequest />
    </Page>
  );
}
