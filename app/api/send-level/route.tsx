// send email to the end user using Resend

import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import * as React from "react";

interface EmailTemplateProps {
  userInfo: {
    firstname: string;
    lastname: string;
    email: string;
    id: string;
  };
  level: string;
  startDate: string;
  additionalContent?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatDateForUrl = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  userInfo,
  level,
  startDate,
  additionalContent,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      color: "#333",
    }}
  >
    <h2 style={{color: "#2c5282"}}>CLASS PROPOSITION</h2>
    <p>Estimado/a,</p>
    <p>Le informamos que hemos completado la revisión de su evaluación.</p>
    <p>
      Datos del candidato: {userInfo.firstname} {userInfo.lastname} (
      {userInfo.email}).
    </p>
    <p>
      El candidato ha obtenido un nivel <strong>{level}</strong>.
    </p>
    <p>
      Estamos satisfechos con los resultados y proponemos comenzar el proceso de
      incorporación a partir de <strong>{formatDate(startDate)}</strong>.
    </p>
    {additionalContent && (
      <div>
        <p>Información adicional:</p>
        <p
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #eaeaea",
          }}
        >
          {additionalContent}
        </p>
      </div>
    )}
    <p>
      Por favor, confirme si esta fecha es adecuada o si necesita realizar algún
      ajuste.
    </p>
    <div style={{marginTop: "20px", marginBottom: "20px"}}>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/accept-proposal/${
          userInfo.id
        }?startDate=${encodeURIComponent(formatDateForUrl(startDate))}`}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          textDecoration: "none",
          borderRadius: "4px",
          marginRight: "15px",
          display: "inline-block",
        }}
      >
        Aceptar
      </a>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/feedback?userId=${userInfo.id}`}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 20px",
          textDecoration: "none",
          borderRadius: "4px",
          display: "inline-block",
        }}
      >
        Rechazar
      </a>
    </div>
    <p>Atentamente,</p>
    <p>
      <strong>El equipo de TLC</strong>
    </p>
    <hr style={{borderTop: "1px solid #eaeaea", margin: "20px 0"}} />
    <p style={{fontSize: "0.8em", color: "#666"}}>
      Este es un correo electrónico automático. Por favor, responda a{" "}
      {userInfo.email} para comunicarse con el candidato.
    </p>
  </div>
);

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const {
    userEmail,
    userFirstname,
    userLastname,
    startDate,
    level,
    additionalContent,
    userId,
  } = await request.json();

  if (!userEmail || !userFirstname || !userLastname || !userId) {
    return NextResponse.json(
      {error: "El email y la información del usuario son obligatorios"},
      {status: 400}
    );
  }

  const {data, error} = await resend.emails.send({
    from: "TLC <mail@tlc-onboarding.com>",
    to: userEmail,
    subject: `Evaluación completada para ${userFirstname} ${userLastname} - Nivel ${level}`,
    react: await EmailTemplate({
      userInfo: {
        firstname: userFirstname,
        lastname: userLastname,
        email: userEmail,
        id: userId,
      },
      level,
      startDate,
      additionalContent,
    }),
  });

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  return NextResponse.json({data}, {status: 200});
}
