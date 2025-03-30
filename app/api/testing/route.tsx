// eslint-disable @next/next/no-img-element

// send email to the end user using Resend

import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const {email, testLink, testUsername, testPassword} = await request.json();

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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h2 style={{color: "#2c5282"}}>¡Hola!</h2>

        <p>
          Nos alegra que estés interesado en nuestros cursos. Para ubicarte en
          el nivel adecuado y asegurarnos de que aproveches al máximo tus
          clases, realizaremos un test en línea que evalúa las siguientes
          habilidades:
        </p>

        <ul
          style={{
            listStyleType: "none",
            padding: "0",
            margin: "20px 0",
          }}
        >
          <li style={{marginBottom: "10px"}}>
            • <strong>Uso de la lengua:</strong> gramática y vocabulario.
          </li>
          <li style={{marginBottom: "10px"}}>
            • <strong>Comprensión escrita:</strong> lectura.
          </li>
          <li style={{marginBottom: "10px"}}>
            • <strong>Comprensión oral:</strong> comprensión de audios.
          </li>
          <li style={{marginBottom: "10px"}}>
            • <strong>Producción escrita:</strong> redacción.
          </li>
          <li style={{marginBottom: "10px"}}>
            • <strong>Producción oral:</strong> expresión hablada.
          </li>
        </ul>

        <p
          style={{
            backgroundColor: "#f7fafc",
            padding: "15px",
            borderRadius: "8px",
            borderLeft: "4px solid #4299e1",
            marginBottom: "20px",
          }}
        >
          <strong>Importante:</strong> Si deseas empezar el curso desde cero, no
          es necesario que realices el test. Solo asegúrate de informarnos para
          organizar todo de la mejor manera.
        </p>

        <div style={{textAlign: "center", margin: "30px 0"}}>
          <img
            src="https://fonts.gstatic.com/s/e/notoemoji/16.0/2728/32.png"
            alt="sparkles"
            style={{width: "32px", height: "32px"}}
          />
        </div>

        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              color: "#2c5282",
              marginTop: "0",
            }}
          >
            Para que tengas la mejor experiencia al realizar la prueba, te
            recomendamos tener en cuenta lo siguiente:
          </h3>

          <div style={{marginBottom: "15px"}}>
            <p>
              <strong>Navegador:</strong> Utiliza Google Chrome y asegúrate de
              que esté actualizado para un mejor rendimiento.
            </p>
            <div style={{textAlign: "center"}}>
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f50d/32.png"
                alt="magnifying glass"
                style={{width: "32px", height: "32px"}}
              />
            </div>
          </div>

          <div style={{marginBottom: "15px"}}>
            <p>
              <strong>Dispositivo:</strong> Te sugerimos hacer el test desde un
              ordenador. Las tabletas o teléfonos pueden presentar problemas de
              compatibilidad y afectar tus resultados. También verifica que no
              haya restricciones de seguridad ni VPNs activas.
            </p>
            <div style={{textAlign: "center"}}>
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f4bb/32.png"
                alt="computer"
                style={{width: "32px", height: "32px"}}
              />
            </div>
          </div>

          <div style={{marginBottom: "15px"}}>
            <p>
              <strong>Conexión a Internet:</strong> Procura tener una conexión
              estable para evitar inconvenientes con la carga de audios o
              imágenes.
            </p>
            <div style={{textAlign: "center"}}>
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f310/32.png"
                alt="globe"
                style={{width: "32px", height: "32px"}}
              />
            </div>
          </div>

          <div style={{marginBottom: "15px"}}>
            <p>
              <strong>Tiempo:</strong> Reserva unos 75 minutos en un lugar
              tranquilo para que puedas concentrarte sin interrupciones.
            </p>
            <div style={{textAlign: "center"}}>
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/16.0/23f0/32.png"
                alt="alarm clock"
                style={{width: "32px", height: "32px"}}
              />
            </div>
          </div>

          <div style={{marginBottom: "15px"}}>
            <p>
              <strong>Honestidad:</strong> Recuerda que este es un test
              diagnóstico para conocer tu nivel real. Responde con sinceridad,
              sin usar ayudas externas como inteligencia artificial, ya que esto
              podría afectar tu ubicación en el curso.
            </p>
            <div style={{textAlign: "center"}}>
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f4dd/32.png"
                alt="memo"
                style={{width: "32px", height: "32px"}}
              />
            </div>
          </div>

          <div style={{marginBottom: "15px"}}>
            <p>
              <strong>Producción Oral:</strong> En la parte de speaking,
              queremos escuchar tu voz auténtica y espontánea. Leer textos
              preparados resultará en una calificación de cero, así que
              &ldquo;relájate y muéstranos tu mejor versión!&rdquo;
            </p>
            <div style={{textAlign: "center"}}>
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f399_fe0f/32.png"
                alt="microphone"
                style={{width: "32px", height: "32px"}}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #3182ce",
            marginBottom: "20px",
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
            Credenciales de acceso:
          </p>
          <div style={{textAlign: "center", marginBottom: "15px"}}>
            <img
              src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f4cc/32.png"
              alt="pushpin"
              style={{width: "32px", height: "32px"}}
            />
          </div>
          <div
            style={{
              backgroundColor: "#ebf8ff",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "20px",
              border: "1px solid #90cdf4",
            }}
          >
            <p style={{margin: "5px 0", fontSize: "1.1em"}}>
              <strong>Usuario:</strong> {testUsername}
            </p>
            <p style={{margin: "5px 0", fontSize: "1.1em"}}>
              <strong>Contraseña:</strong> {testPassword}
            </p>
          </div>

          <div style={{textAlign: "center", marginTop: "30px"}}>
            <a
              href={testLink}
              style={{
                backgroundColor: "#3182ce",
                color: "white",
                padding: "16px 32px",
                textDecoration: "none",
                borderRadius: "8px",
                display: "inline-block",
                margin: "10px 0",
                fontSize: "1.3em",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
              }}
            >
              COMENZAR EL TEST
            </a>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            marginTop: "30px",
            paddingTop: "20px",
          }}
        >
          <p style={{marginBottom: "10px"}}>
            <strong>¿Necesitas ayuda técnica?</strong>
          </p>
          <div style={{textAlign: "center", margin: "15px 0"}}>
            <img
              src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f517/32.png"
              alt="link"
              style={{width: "32px", height: "32px"}}
            />
          </div>
          <p>
            Estamos aquí para apoyarte. Puedes responder a este correo o
            escribirnos por Telegram: The Language Corp. Nuestro horario de
            atención es de 7:00 a.m. a 3:00 p.m. (hora de Colombia), de lunes a
            viernes. Si nos escribes después de ese horario, ¡no te preocupes!
            Te responderemos al siguiente día hábil.
          </p>
        </div>

        <div style={{textAlign: "center", margin: "30px 0"}}>
          <img
            src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f31f/32.png"
            alt="glowing star"
            style={{width: "32px", height: "32px"}}
          />
        </div>

        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#2c5282",
            fontSize: "1.1em",
            fontWeight: "bold",
          }}
        >
          ¡Te deseamos mucho éxito en el test y esperamos verte pronto en clase!
        </p>
      </div>
    ),
  });

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  return NextResponse.json({data}, {status: 200});
}
