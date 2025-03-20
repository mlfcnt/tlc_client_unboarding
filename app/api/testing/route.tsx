// send email to the end user using Resend

import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const {email, testLink} = await request.json();

  const {data, error} = await resend.emails.send({
    from: "TLC <mail@tlc-onboarding.com>",
    to: email,
    subject: "Su prueba de TLC está lista",
    react: (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
          color: "#333",
        }}
      >
        <h2 style={{color: "#2c5282"}}>Estimado/a candidato/a,</h2>
        <p>
          Nos complace informarle que su prueba de evaluación ya está
          disponible.
        </p>
        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #3182ce",
            margin: "20px 0",
          }}
        >
          <p
            style={{
              fontSize: "1.1em",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#2c5282",
            }}
          >
            👉 Haga clic en el botón a continuación para comenzar su prueba:
          </p>
          <p style={{textAlign: "center"}}>
            <a
              href={testLink}
              style={{
                backgroundColor: "#3182ce",
                color: "white",
                padding: "15px 30px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                margin: "10px 0",
                fontSize: "1.2em",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              Comenzar mi prueba ahora
            </a>
          </p>
        </div>
        <p>
          Le deseamos mucho éxito en su evaluación. Si tiene alguna pregunta o
          inconveniente, no dude en contactarnos.
        </p>
        <p>Atentamente,</p>
        <p>
          <strong>El equipo de TLC</strong>
        </p>
        <hr style={{borderTop: "1px solid #eaeaea", margin: "20px 0"}} />
        <p style={{fontSize: "0.8em", color: "#666"}}>
          Este es un correo electrónico automático. Por favor, no responda a
          este mensaje.
        </p>
      </div>
    ),
  });

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  return NextResponse.json({data}, {status: 200});
}
