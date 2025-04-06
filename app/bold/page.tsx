"use client";

import Script from "next/script";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

async function fetchPaymentData(onboardingRequestId: string) {
  const response = await fetch("/api/bold", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({onboardingRequestId}),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch payment data");
  }

  return response.json();
}

export default function Bold() {
  const {
    data: paymentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paymentData", "ABCD3000"],
    queryFn: () => fetchPaymentData("ABCD3000"),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  // Function to create the button script
  const createButtonScript = (config: any) => {
    const script = document.createElement("script");
    script.id = "payment-button";
    script.setAttribute("data-bold-button", "");
    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, value as string);
    });
    return script;
  };

  // Effect to handle button initialization
  useEffect(() => {
    if (paymentData) {
      const container = document.getElementById("button-container");
      if (container) {
        // Clear previous button if any
        container.innerHTML = "";
        // Create and append new button
        const buttonScript = createButtonScript(paymentData.buttonConfig);
        container.appendChild(buttonScript);
      }
    }
  }, [paymentData]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Bold Payment Button Script */}
      <Script
        id="bold-payment-button"
        src="https://checkout.bold.co/library/boldPaymentButton.js"
        strategy="lazyOnload"
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Product Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {paymentData?.pageData.productName}
                </h2>
                <p className="mt-1 text-gray-500">
                  {paymentData?.pageData.productDescription}
                </p>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {paymentData?.pageData &&
                      formatCurrency(paymentData.pageData.amount)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    (Including VAT)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">
                  {paymentData?.pageData.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency</span>
                <span className="font-medium">
                  {paymentData?.pageData.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  VAT ({paymentData?.pageData.vatPercentage}%)
                </span>
                <span className="font-medium">
                  {paymentData?.pageData &&
                    formatCurrency(paymentData.pageData.vatAmount)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {paymentData?.pageData &&
                    formatCurrency(paymentData.pageData.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    Loading payment options...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">
                  <p>
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
                  </p>
                </div>
              ) : paymentData ? (
                <div id="button-container"></div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure payment powered by Bold</p>
          <p className="mt-2">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
