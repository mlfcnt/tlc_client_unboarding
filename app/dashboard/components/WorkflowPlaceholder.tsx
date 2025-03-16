"use client";

import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock} from "lucide-react";

interface WorkflowPlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  comingSoon?: boolean;
}

export const WorkflowPlaceholder = ({
  title,
  description,
  icon = <Clock className="h-4 w-4" />,
  comingSoon = true,
}: WorkflowPlaceholderProps) => {
  return (
    <Card className="hover:shadow-md transition-all opacity-70">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
          {comingSoon && (
            <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              Coming soon
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};
