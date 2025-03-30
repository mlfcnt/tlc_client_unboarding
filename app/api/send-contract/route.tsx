import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import * as React from "react";
import {renderToBuffer} from "@react-pdf/renderer";
import {ContractDocument} from "@/app/dashboard/components/Steps/StepsActions/Step8/ContractDocument";

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
    console.log("Received contract data:", JSON.stringify(data, null, 2));

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

    // Format schedule time properly
    if (data.schedule && !data.schedule.includes(":")) {
      // If schedule is just a number without colon, format it
      if (!isNaN(parseInt(data.schedule))) {
        const hour = parseInt(data.schedule);
        data.schedule = `${hour.toString().padStart(2, "0")}:00`;
      } else {
        console.error("Invalid schedule format:", data.schedule);
        return NextResponse.json(
          {error: "Invalid schedule format. Expected HH:MM"},
          {status: 400}
        );
      }
    }

    // Generate PDF buffer
    try {
      console.log(
        "Generating PDF with data:",
        JSON.stringify(
          {
            studentName: data.studentName,
            documentId: data.documentId,
            email: data.email,
            phone: data.phone,
            courseType: data.courseType,
            days: data.days,
            schedule: data.schedule,
            modality: data.modality,
            totalValue: data.totalValue,
            paymentMethod: data.paymentMethod,
            paymentDates: data.paymentDates,
            startDate: data.startDate,
          },
          null,
          2
        )
      );

      const pdfDoc = <ContractDocument data={data} showHighlights={false} />;
      const pdfBuffer = await renderToBuffer(pdfDoc);

      // Send email with PDF attachment
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
        throw error;
      }

      return NextResponse.json({data: emailData}, {status: 200});
    } catch (pdfError: any) {
      console.error("PDF generation error:", pdfError);
      console.error("Error details:", pdfError.stack);
      return NextResponse.json(
        {error: `PDF generation failed: ${pdfError.message}`},
        {status: 500}
      );
    }
  } catch (error: any) {
    console.error("Error sending contract:", error);
    return NextResponse.json(
      {error: error.message || "Failed to send contract"},
      {status: 500}
    );
  }
}
