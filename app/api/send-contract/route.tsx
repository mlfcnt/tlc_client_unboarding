/// <reference types="node" />
import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import * as React from "react";
import puppeteer from "puppeteer-core";
// Using any type for chromium to bypass TypeScript errors
const chromium: any = require("@sparticuz/chromium");

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

// Function to translate weekday
const translateDay = (day: string) => {
  const translations: Record<string, string> = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };
  return translations[day] || day;
};

// Generate HTML contract
const generateContractHtml = (data: any) => {
  const translatedDays = Array.isArray(data.days)
    ? data.days.map((day: string) => translateDay(day)).join(", ")
    : "";

  const currentDate = new Date().toLocaleDateString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contrato de Servicios - ${data.studentName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          margin: 40px;
          font-size: 12px;
        }
        .title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .section {
          margin-bottom: 15px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .highlighted {
          font-weight: bold;
        }
        .field {
          margin-bottom: 5px;
        }
        .field-label {
          font-weight: bold;
        }
        .list-item {
          margin-left: 15px;
          margin-bottom: 3px;
        }
        .signature-section {
          margin-top: 40px;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          margin-top: 30px;
          margin-bottom: 5px;
          width: 60%;
        }
      </style>
    </head>
    <body>
      <div class="title">CONTRATO DE PRESTACIÓN DE SERVICIOS EDUCATIVOS</div>

      <div class="section">
        <p>Entre:</p>
        <p class="field">
          <span class="field-label">Nombre del Estudiante: </span>
          ${data.studentName}
        </p>
        <p class="field">
          <span class="field-label">Documento de Identidad: </span>
          ${data.documentId}
        </p>
        <p class="field">
          <span class="field-label">Correo Electrónico: </span>
          ${data.email}
        </p>
        <p class="field">
          <span class="field-label">Teléfono: </span>
          ${data.phone}
        </p>
        <p>
          Y la institución <span class="highlighted">The Language Club SAS</span>, identificada
          con NIT <span class="highlighted">901024417-1</span>, representada
          legalmente por <span class="highlighted">Maria Paula Galeano Casas</span>,
          identificada con C.C. <span class="highlighted">1020727913</span>,
          en adelante "La Institución", se celebra el presente contrato de
          inscripción bajo las siguientes condiciones:
        </p>
      </div>

      <div class="section">
        <div class="section-title">1. OBJETO DEL CONTRATO</div>
        <p>
          El presente contrato regula la inscripción y participación del
          estudiante en el curso de inglés de <span class="highlighted">un (1) año</span>
          de duración, en el marco de la legislación vigente en Colombia, en especial las
          disposiciones del Código de Comercio y las normas aplicables en materia de
          educación no formal.
        </p>
      </div>

      <div class="section">
        <div class="section-title">2. HORARIO Y MODALIDAD</div>
        <p>
          El estudiante asistirá a las clases bajo la modalidad y horario
          acordados:
        </p>
        <p class="list-item">
          <span class="field-label">• Tipo de curso: </span>
          ${data.courseType === "group" ? "Grupo" : "Clases privadas"}
        </p>
        <p class="list-item">
          <span class="field-label">• Fecha de inicio: </span>
          ${data.startDate}
        </p>
        <p class="list-item">
          <span class="field-label">• Día(s): </span>
          ${translatedDays}
        </p>
        <p class="list-item">
          <span class="field-label">• Hora: </span>
          ${data.schedule}
        </p>
        <p class="list-item">
          <span class="field-label">• Modalidad: </span>
          ${data.modality === "in-person" ? "Presencial" : "Virtual"}
        </p>
        <p>
          Si el estudiante toma clases privadas, estas serán programadas de
          común acuerdo con La Institución y estarán sujetas a la
          disponibilidad del docente.
        </p>
      </div>

      <div class="section">
        <div class="section-title">3. VALOR DEL CONTRATO Y FORMA DE PAGO</div>
        <p class="list-item">
          <span class="field-label">• Valor total del curso: </span>
          $ ${data.totalValue} COP
        </p>
        <p class="list-item">
          <span class="field-label">• Forma de pago: </span>
          ${
            data.paymentMethod === "single"
              ? "Única cuota"
              : data.paymentMethod === "monthly"
              ? "Cuotas mensuales"
              : "Otro"
          }
        </p>
        <p class="list-item">
          <span class="field-label">• Fecha(s) de pago: </span>
          ${data.paymentDates}
        </p>
        <p>
          El estudiante o su responsable financiero se compromete a realizar
          los pagos en las fechas acordadas. El incumplimiento en los pagos
          puede generar suspensión del servicio hasta que se regularicen las
          obligaciones.
        </p>
      </div>

      <div class="section">
        <div class="section-title">4. CESIÓN DEL CONTRATO</div>
        <p>
          El contrato podrá ser cedido a otra persona, siempre que esta entre
          en el mismo grupo y horario establecido o, en el caso de clases
          privadas, mantenga las condiciones previamente acordadas. La cesión
          deberá ser informada a La Institución con un mínimo de cinco (5)
          días hábiles de anticipación y estará sujeta a la validación por
          parte de La Institución.
        </p>
      </div>

      <div class="section">
        <div class="section-title">5. POLÍTICA DE DEVOLUCIÓN Y CANCELACIÓN</div>
        <p>
          No se realizarán devoluciones de dinero bajo ninguna circunstancia.
          La inscripción es definitiva. En caso de que el estudiante desista
          de continuar el curso, podrá ceder su contrato según lo estipulado
          en la cláusula 4.
        </p>
      </div>

      <div class="section">
        <div class="section-title">6. ASISTENCIA Y COMPROMISO DEL ESTUDIANTE</div>
        <p>
          Se recomienda una asistencia mínima del 80% de las clases
          programadas para garantizar un adecuado progreso en el aprendizaje.
          La Institución no se hace responsable por el bajo rendimiento
          académico derivado de una asistencia insuficiente.
        </p>
      </div>

      <div class="section">
        <div class="section-title">7. CRITERIOS DE APROBACIÓN</div>
        <p>
          Para aprobar el curso, el estudiante debe obtener una calificación
          mínima de 3.0 en una escala de 0 a 5.0. En caso de no alcanzar esta
          calificación, el nivel deberá ser repetido. La evaluación se
          realizará conforme a los criterios establecidos por La Institución y
          debidamente comunicados al estudiante.
        </p>
      </div>

      <div class="section">
        <div class="section-title">8. INTERESES POR MORA</div>
        <p>
          En caso de retraso en los pagos, el estudiante o su responsable
          financiero incurrirá en un interés de mora del
          <span class="highlighted">1.5%</span> mensual sobre el saldo
          adeudado, contado a partir del día siguiente a la fecha de
          vencimiento de la obligación. La Institución se reserva el derecho
          de suspender la prestación del servicio hasta que se regularicen los
          pagos. Si la mora supera los
          <span class="highlighted">dos (2) meses</span>, La Institución podrá
          dar por terminado el contrato y ceder el cupo a otro estudiante sin
          obligación de reembolso.
        </p>
      </div>

      <div class="section">
        <div class="section-title">9. CLÁUSULA DE FUERZA MAYOR</div>
        <p>
          La Institución no será responsable por la interrupción o
          modificación del servicio debido a circunstancias de fuerza mayor o
          caso fortuito, tales como desastres naturales, crisis sanitarias,
          conflictos sociales o cualquier otra situación imprevisible e
          inevitable.
        </p>
      </div>

      <div class="section">
        <div class="section-title">10. CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS</div>
        <p>
          El estudiante autoriza a La Institución para recolectar, almacenar y
          procesar sus datos personales con el fin de gestionar su inscripción
          y participación en el curso, en cumplimiento de la Ley 1581 de 2012
          y sus decretos reglamentarios. Los datos no serán compartidos con
          terceros sin autorización expresa del estudiante, salvo en los casos
          previstos por la ley.
        </p>
      </div>

      <div class="section">
        <div class="section-title">11. RESOLUCIÓN DE CONFLICTOS Y CLÁUSULA COMPROMISORIA</div>
        <p>
          Cualquier controversia derivada de la interpretación, ejecución o
          terminación del presente contrato será resuelta mediante
          conciliación ante un Centro de Conciliación autorizado en Colombia.
          Si no se llega a un acuerdo, las partes podrán acudir a un tribunal
          de arbitramento de conformidad con la legislación colombiana
          vigente.
        </p>
      </div>

      <div class="section">
        <div class="section-title">12. RESPONSABILIDAD Y CONDICIONES ADICIONALES</div>
        <p>
          La Institución se compromete a brindar los contenidos, recursos y
          metodología pedagógica adecuados para el desarrollo del curso. Sin
          embargo, el avance y éxito del estudiante
          <span class="highlighted">dependerán</span> de su esfuerzo y
          compromiso.
        </p>
        <p>
          El estudiante acepta que este contrato no garantiza la obtención de
          certificaciones oficiales fuera de las otorgadas por La Institución
          ni el acceso automático a niveles superiores sin cumplir con los
          requisitos de evaluación.
        </p>
      </div>

      <div class="section">
        <div class="section-title">13. ACEPTACIÓN DE TÉRMINOS</div>
        <p>
          Al firmar este contrato, el estudiante declara haber leído,
          comprendido y aceptado las condiciones aquí establecidas. Así mismo,
          reconoce que La Institución opera bajo la normativa educativa
          colombiana y acatará cualquier reglamento interno vigente.
        </p>
      </div>

      <div class="signature-section">
        <p>Firmas:</p>

        <div class="signature-line"></div>
        <p class="field">
          <span class="field-label">Estudiante: </span>
          ${data.studentName}
        </p>
        <p class="field">
          <span class="field-label">Documento de Identidad: </span>
          ${data.documentId}
        </p>
        <p class="field">
          <span class="field-label">Fecha: </span>
          ____________________
        </p>

        <div class="signature-line"></div>
        <p class="field">
          <span class="field-label">Representante de La Institución:</span>
          Maria Paula Galeano Casas
        </p>
        <p class="field">
          <span class="field-label">C.C.:</span> 1020727913
        </p>
        <p class="field">
          <span class="field-label">Fecha:</span> ${currentDate}
        </p>
      </div>
    </body>
    </html>
  `;
};

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

    // Generate PDF buffer using Puppeteer
    try {
      console.log("Generating HTML template");
      const htmlContent = generateContractHtml(cleanData);

      console.log("Launching Puppeteer browser");
      // Configure Puppeteer for serverless environment
      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      });

      console.log("Creating new page");
      const page = await browser.newPage();
      await page.setContent(htmlContent, {waitUntil: "networkidle0"});

      console.log("Generating PDF");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {top: "1cm", right: "1cm", bottom: "1cm", left: "1cm"},
      });

      console.log("Closing browser");
      await browser.close();

      console.log("PDF generated successfully, size:", pdfBuffer.length);

      // Convert Uint8Array to Buffer for Resend API
      const bufferData = Buffer.from(pdfBuffer);

      // Send email with PDF attachment
      console.log("Attempting to send email");
      const {data: emailData, error} = await resend.emails.send({
        from: "TLC <mail@tlc-onboarding.com>",
        to: data.email,
        subject: `Contrato de Servicios - ${data.studentName}`,
        react: <EmailTemplate studentName={data.studentName} />,
        attachments: [
          {
            filename: `contrato_${data.studentName.replace(/\s+/g, "_")}.pdf`,
            content: bufferData,
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
