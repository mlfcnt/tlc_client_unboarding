import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import * as React from "react";
import {renderToBuffer} from "@react-pdf/renderer";
import {ContractDocument} from "@/app/dashboard/components/Steps/StepsActions/Step8/ContractDocument";

// Debugging function to safely stringify objects
const safeStringify = (obj: any) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return `[Error stringifying object: ${
      error instanceof Error ? error.message : String(error)
    }]`;
  }
};

const EmailTemplate: React.FC<{studentName: string}> = ({studentName}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      color: "#333",
    }}
  >
    <h2 style={{color: "#2c5282"}}>CONTRATO DE SERVICIOS</h2>
    <p>Estimado/a {studentName},</p>
    <p>Adjunto encontrará el contrato de servicios para su revisión y firma.</p>
    <p>
      Por favor, revise detenidamente el documento y si está de acuerdo con los
      términos y condiciones, proceda a firmarlo.
    </p>
    <p>
      Una vez firmado, por favor envíenos una copia del documento firmado
      respondiendo a este correo.
    </p>
    <p>Si tiene alguna pregunta o inquietud, no dude en contactarnos.</p>
    <p>Atentamente,</p>
    <p>
      <strong>El equipo de TLC</strong>
    </p>
    <hr style={{borderTop: "1px solid #eaeaea", margin: "20px 0"}} />
    <p style={{fontSize: "0.8em", color: "#666"}}>
      Este es un correo electrónico automático. Por favor, no responda
      directamente a este mensaje.
    </p>
  </div>
);

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await request.json();
    console.log("Received contract data:", safeStringify(data));

    // Validate required fields
    if (!data.email || !data.studentName || !data.userId) {
      return NextResponse.json(
        {error: "Email, student name, and user ID are required"},
        {status: 400}
      );
    }

    // Ensure all required fields for the ContractDocument are present
    if (
      !data.documentId ||
      !data.phone ||
      !data.courseType ||
      !data.days ||
      !Array.isArray(data.days) ||
      data.days.length === 0 ||
      !data.schedule ||
      !data.modality ||
      !data.totalValue ||
      !data.paymentMethod ||
      !data.paymentDates ||
      !data.startDate
    ) {
      return NextResponse.json(
        {error: "Missing required contract fields"},
        {status: 400}
      );
    }

    // Ensure the data is properly formatted
    const cleanData = {
      studentName: String(data.studentName),
      documentId: String(data.documentId),
      email: String(data.email),
      phone: String(data.phone),
      courseType: String(data.courseType),
      days: Array.isArray(data.days) ? data.days.map(String) : [],
      schedule: String(data.schedule),
      modality: String(data.modality),
      totalValue: String(data.totalValue),
      paymentMethod: String(data.paymentMethod),
      paymentDates: String(data.paymentDates),
      startDate: String(data.startDate),
    };

    console.log("Cleaned data for PDF generation:", safeStringify(cleanData));

    // Generate PDF buffer
    try {
      console.log("Attempting to generate PDF...");

      const pdfDoc = (
        <ContractDocument data={cleanData} showHighlights={false} />
      );
      console.log("PDF document component created successfully");

      const pdfBuffer = await renderToBuffer(pdfDoc);
      console.log("PDF buffer generated successfully, size:", pdfBuffer.length);

      // Send email with PDF attachment
      console.log("Attempting to send email...");
      const {data: emailData, error} = await resend.emails.send({
        from: "TLC <mail@tlc-onboarding.com>",
        to: data.email,
        subject: `Contrato de Servicios - ${data.studentName}`,
        react: <EmailTemplate studentName={data.studentName} />,
        attachments: [
          {
            filename: `contrato_${data.studentName.replace(/\s+/g, "_")}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error("Resend API error:", error);
        throw error;
      }

      console.log("Email sent successfully:", safeStringify(emailData));
      return NextResponse.json({data: emailData}, {status: 200});
    } catch (pdfError: any) {
      console.error("PDF generation or email sending error:", pdfError);
      if (pdfError.stack) {
        console.error("Error stack trace:", pdfError.stack);
      }

      return NextResponse.json(
        {
          error: `PDF generation failed: ${
            pdfError.message || "Unknown error"
          }`,
          errorType: pdfError.name || "UnknownError",
          errorDetails: pdfError.stack || "No stack trace available",
        },
        {status: 500}
      );
    }
  } catch (error: any) {
    console.error("Error processing contract request:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to send contract",
        errorType: error.name || "UnknownError",
        errorDetails: error.stack || "No stack trace available",
      },
      {status: 500}
    );
  }
}
