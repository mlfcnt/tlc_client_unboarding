import {XCircleIcon} from "lucide-react";
import React from "react";
import {toast} from "sonner";

export const errorToast = (message: string) => {
  return toast.error(message, {
    icon: <XCircleIcon className="w-4 h-4" />,
    className: "h-20",
    style: {
      fontSize: "1.0rem",
      backgroundColor: "rgb(235, 183, 191)",
      color: "black",
      border: "4px solid black",
      borderRadius: "0.5rem",
      boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
      fontWeight: "bold",
      padding: "0.75rem",
      transform: "rotate(-0.5deg)",
    },
  });
};
