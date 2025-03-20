// send email to the end user using Resend

import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import * as React from "react";

interface EmailTemplateProps {
  userInfo: {
    firstname: string;
    lastname: string;
    email: string;
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
  }).format(date);
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
    <h2 style={{color: "#2c5282"}}>Estimado/a Administrador/a,</h2>
    <p>
      Le informamos que hemos completado la revisión de la evaluación para el
      candidato{" "}
      <strong>
        {userInfo.firstname} {userInfo.lastname}
      </strong>{" "}
      ({userInfo.email}).
    </p>
    <p>
      El candidato ha obtenido un nivel <strong>{level}</strong>.
    </p>
    <p>
      Estamos satisfechos con los resultados y proponemos comenzar el proceso de
      incorporación a partir del <strong>{formatDate(startDate)}</strong>.
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
  } = await request.json();

  if (!userEmail || !userFirstname || !userLastname) {
    return NextResponse.json(
      {error: "El email del usuario es obligatorio"},
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
