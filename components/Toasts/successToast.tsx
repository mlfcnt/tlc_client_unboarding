import {CheckCircleIcon} from "lucide-react";
import {toast} from "sonner";

export const successToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircleIcon className="w-4 h-4" />,
    className: "h-20",
    style: {
      fontSize: "1.1rem",
      backgroundColor: "rgb(183, 235, 191)",
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
