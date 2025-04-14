import {CheckCircle2, XCircle, AlertCircle} from "lucide-react";
import Link from "next/link";

type PaymentStatus = "approved" | "rejected" | "failed" | "pending";

export default function PaymentResult({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const status = searchParams.status?.toString().toLowerCase() as PaymentStatus;
  const orderId = searchParams.order_id?.toString();
  const transactionId = searchParams.transaction_id?.toString();
  const paymentMethod = searchParams.payment_method?.toString();

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
          buttonText: "Return to Dashboard",
          buttonLink: "/dashboard",
          buttonStyle: "bg-green-500 hover:bg-green-600",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: "Payment Rejected",
          description:
            "Your payment was rejected. Please check your payment details and try again.",
          buttonText: "Try Again",
          buttonLink: "/bold",
          buttonStyle: "bg-red-500 hover:bg-red-600",
        };
      case "failed":
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: "Payment Failed",
          description:
            "There was an error processing your payment. Please try again.",
          buttonText: "Try Again",
          buttonLink: "/bold",
          buttonStyle: "bg-red-500 hover:bg-red-600",
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
          title: "Payment Status Unknown",
          description: "We couldn't determine the status of your payment.",
          buttonText: "Contact Support",
          buttonLink: "/support",
          buttonStyle: "bg-yellow-500 hover:bg-yellow-600",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center space-y-4">
            {config.icon}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {config.title}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {config.description}
            </p>

            {/* Payment Details */}
            {orderId && (
              <div className="mt-4 w-full">
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-500">Order ID:</dt>
                      <dd className="text-gray-900">{orderId}</dd>
                    </div>
                    {transactionId && (
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">
                          Transaction ID:
                        </dt>
                        <dd className="text-gray-900">{transactionId}</dd>
                      </div>
                    )}
                    {paymentMethod && (
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">
                          Payment Method:
                        </dt>
                        <dd className="text-gray-900">{paymentMethod}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6 w-full">
              <Link
                href={config.buttonLink}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${config.buttonStyle} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {config.buttonText}
              </Link>
            </div>

            {/* Support Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Need help?{" "}
              <Link
                href="/support"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
