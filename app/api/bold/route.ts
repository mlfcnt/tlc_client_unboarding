import {NextResponse} from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {onboardingRequestId} = body;

    // Validate order ID
    if (!onboardingRequestId) {
      return NextResponse.json({error: "Missing order ID"}, {status: 400});
    }

    const apiKey = process.env.BOLD_API_KEY;
    const apiSecret = process.env.BOLD_SECRET_KEY;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {error: "Missing API configuration"},
        {status: 500}
      );
    }

    // TODO: In production, fetch these details from your database based on orderId
    const amount = "3500000";
    const currency = "COP";

    // Generate integrity signature according to Bold's documentation
    // Format: {orderId}{amount}{currency}{secretKey}
    const signatureString = `${onboardingRequestId}${amount}${currency}${apiSecret}`;
    const signature = crypto
      .createHash("sha256")
      .update(signatureString)
      .digest("hex");

    // Prepare customer data and billing address
    const customerData = {
      email: "example@correo.com",
      fullName: "Lola Flores",
      phone: "3040777777",
      dialCode: "+57",
      documentNumber: "123456789",
      documentType: "CC",
    };

    const billingAddress = {
      address: "Calle 123 # 4-5",
      zipCode: "123456",
      city: "Bogota",
      state: "Cundinamarca",
      country: "CO",
    };

    // Calculate expiration date (24 hours from now) in nanoseconds
    // Convert milliseconds to nanoseconds (1 millisecond = 1,000,000 nanoseconds)
    const expirationDate = (Date.now() + 24 * 60 * 60 * 1000) * 1_000_000;

    return NextResponse.json({
      buttonConfig: {
        "data-bold-button": "light-L",
        "data-api-key": apiKey,
        "data-amount": amount,
        "data-currency": currency,
        "data-order-id": onboardingRequestId,
        "data-description": "English Course - 14 Hours",
        "data-redirection-url": "https://www.tlc-unboarding.com/payment-result",
        "data-tax": "vat-19",
        "data-customer-data": JSON.stringify(customerData),
        "data-billing-address": JSON.stringify(billingAddress),
        "data-expiration-date": expirationDate.toString(),
        "data-origin-url": "https://www.tlc-unboarding.com/bold",
        "data-render-mode": "embedded",
        "data-integrity-signature": signature,
        "data-extra-data-1": "English Course",
        "data-extra-data-2": "14 Hours",
      },
      pageData: {
        productName: "English Course - 14 Hours",
        productDescription: "Comprehensive English language training program",
        amount: parseInt(amount),
        currency,
        vatPercentage: 19,
        vatAmount: Math.round(parseInt(amount) * 0.19),
        totalAmount: parseInt(amount),
        orderId: onboardingRequestId,
      },
    });
  } catch (error) {
    console.error("Error generating Bold payment configuration:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
