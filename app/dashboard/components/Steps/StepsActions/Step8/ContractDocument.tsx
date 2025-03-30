import React from "react";
import {Page, Text, View, Document, StyleSheet} from "@react-pdf/renderer";
import {z} from "zod";

// Define the schema based on SendContractForm's schema
const contractDataSchema = z.object({
  studentName: z.string(),
  documentId: z.string(),
  email: z.string(),
  phone: z.string(),
  courseType: z.string(),
  days: z.array(z.string()),
  hour: z.string(),
  modality: z.string(),
  totalValue: z.string(),
  paymentMethod: z.string(),
  paymentDates: z.string(),
  startDate: z.string(),
});

type ContractData = z.infer<typeof contractDataSchema>;

interface ContractDocumentProps {
  data: ContractData;
  showHighlights?: boolean;
}

// Register fonts (ensure font files are available, e.g., in public/fonts)
// Font.register({
//     family: 'Roboto',
//     fonts: [
//         { src: '/fonts/Roboto-Regular.ttf' }, // path to font file
//         { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
//     ]
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.3,
  },
  title: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  text: {
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  dynamicField: {
    padding: "2 4",
    borderRadius: 2,
  },
  dynamicFieldHighlight: {
    backgroundColor: "#FFFDE7",
  },
  dynamicLabel: {
    fontWeight: "bold",
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 3,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 30,
    marginBottom: 5,
    width: "60%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    textAlign: "center",
    color: "grey",
    fontSize: 8,
  },
});

// Create Document Component
export const ContractDocument = ({
  data,
  showHighlights = false,
}: ContractDocumentProps) => {
  // Validate the input data
  try {
    contractDataSchema.parse(data);
  } catch (error) {
    console.error("Contract data validation failed:", error);
    throw new Error("Invalid contract data provided");
  }

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

  const currentDate = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getDynamicFieldStyle = () => {
    return showHighlights
      ? {...styles.dynamicField, ...styles.dynamicFieldHighlight}
      : styles.dynamicField;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          CONTRATO DE PRESTACIÓN DE SERVICIOS EDUCATIVOS
        </Text>

        <View style={styles.section}>
          <Text style={styles.text}>Entre:</Text>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Nombre del Estudiante: </Text>
            <Text style={getDynamicFieldStyle()}>{data.studentName}</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Documento de Identidad: </Text>
            <Text style={getDynamicFieldStyle()}>{data.documentId}</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Correo Electrónico: </Text>
            <Text style={getDynamicFieldStyle()}>{data.email}</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Teléfono: </Text>
            <Text style={getDynamicFieldStyle()}>{data.phone}</Text>
          </Text>
          <Text style={styles.text}>
            Y la institución{" "}
            <Text style={styles.bold}>The Language Club SAS</Text>, identificada
            con NIT <Text style={styles.bold}>901024417-1</Text>, representada
            legalmente por{" "}
            <Text style={styles.bold}>Maria Paula Galeano Casas</Text>,
            identificada con C.C. <Text style={styles.bold}>1020727913</Text>,
            en adelante "La Institución", se celebra el presente contrato de
            inscripción bajo las siguientes condiciones:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. OBJETO DEL CONTRATO</Text>
          <Text style={styles.text}>
            El presente contrato regula la inscripción y participación del
            estudiante en el curso de inglés de{" "}
            <Text style={styles.bold}>un (1) año</Text> de duración, en el marco
            de la legislación vigente en Colombia, en especial las disposiciones
            del Código de Comercio y las normas aplicables en materia de
            educación no formal.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. HORARIO Y MODALIDAD</Text>
          <Text style={styles.text}>
            El estudiante asistirá a las clases bajo la modalidad y horario
            acordados:
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Tipo de curso: </Text>
            <Text style={getDynamicFieldStyle()}>
              {data.courseType === "group" ? "Grupo" : "Clases privadas"}
            </Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Fecha de inicio: </Text>
            <Text style={getDynamicFieldStyle()}>{data.startDate}</Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Día(s): </Text>
            <Text style={getDynamicFieldStyle()}>
              {data.days.map((day) => translateDay(day)).join(", ")}
            </Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Hora: </Text>
            <Text style={getDynamicFieldStyle()}>
              {data.hour
                ? new Date(`2000-01-01T${data.hour}`)
                    .toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .replace(/(AM|PM)/, (match) => match.toLowerCase())
                : ""}
            </Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Modalidad: </Text>
            <Text style={getDynamicFieldStyle()}>
              {data.modality === "in-person" ? "Presencial" : "Virtual"}
            </Text>
          </Text>
          <Text style={styles.text}>
            Si el estudiante toma clases privadas, estas serán programadas de
            común acuerdo con La Institución y estarán sujetas a la
            disponibilidad del docente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            3. VALOR DEL CONTRATO Y FORMA DE PAGO
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Valor total del curso: </Text>
            <Text style={getDynamicFieldStyle()}>$ {data.totalValue} COP</Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Forma de pago: </Text>
            <Text style={getDynamicFieldStyle()}>
              {data.paymentMethod === "single"
                ? "Única cuota"
                : data.paymentMethod === "monthly"
                ? "Cuotas mensuales"
                : "Otro"}
            </Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.dynamicLabel}>• Fecha(s) de pago: </Text>
            <Text style={getDynamicFieldStyle()}>{data.paymentDates}</Text>
          </Text>
          <Text style={styles.text}>
            El estudiante o su responsable financiero se compromete a realizar
            los pagos en las fechas acordadas. El incumplimiento en los pagos
            puede generar suspensión del servicio hasta que se regularicen las
            obligaciones.
          </Text>
        </View>

        {/* --- Sections 4-13 --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. CESIÓN DEL CONTRATO</Text>
          <Text style={styles.text}>
            El contrato podrá ser cedido a otra persona, siempre que esta entre
            en el mismo grupo y horario establecido o, en el caso de clases
            privadas, mantenga las condiciones previamente acordadas. La cesión
            deberá ser informada a La Institución con un mínimo de cinco (5)
            días hábiles de anticipación y estará sujeta a la validación por
            parte de La Institución.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            5. POLÍTICA DE DEVOLUCIÓN Y CANCELACIÓN
          </Text>
          <Text style={styles.text}>
            No se realizarán devoluciones de dinero bajo ninguna circunstancia.
            La inscripción es definitiva. En caso de que el estudiante desista
            de continuar el curso, podrá ceder su contrato según lo estipulado
            en la cláusula 4.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            6. ASISTENCIA Y COMPROMISO DEL ESTUDIANTE
          </Text>
          <Text style={styles.text}>
            Se recomienda una asistencia mínima del 80% de las clases
            programadas para garantizar un adecuado progreso en el aprendizaje.
            La Institución no se hace responsable por el bajo rendimiento
            académico derivado de una asistencia insuficiente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. CRITERIOS DE APROBACIÓN</Text>
          <Text style={styles.text}>
            Para aprobar el curso, el estudiante debe obtener una calificación
            mínima de 3.0 en una escala de 0 a 5.0. En caso de no alcanzar esta
            calificación, el nivel deberá ser repetido. La evaluación se
            realizará conforme a los criterios establecidos por La Institución y
            debidamente comunicados al estudiante.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. INTERESES POR MORA</Text>
          <Text style={styles.text}>
            En caso de retraso en los pagos, el estudiante o su responsable
            financiero incurrirá en un interés de mora del{" "}
            <Text style={styles.bold}>1.5%</Text> mensual sobre el saldo
            adeudado, contado a partir del día siguiente a la fecha de
            vencimiento de la obligación. La Institución se reserva el derecho
            de suspender la prestación del servicio hasta que se regularicen los
            pagos. Si la mora supera los{" "}
            <Text style={styles.bold}>dos (2) meses</Text>, La Institución podrá
            dar por terminado el contrato y ceder el cupo a otro estudiante sin
            obligación de reembolso.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. CLÁUSULA DE FUERZA MAYOR</Text>
          <Text style={styles.text}>
            La Institución no será responsable por la interrupción o
            modificación del servicio debido a circunstancias de fuerza mayor o
            caso fortuito, tales como desastres naturales, crisis sanitarias,
            conflictos sociales o cualquier otra situación imprevisible e
            inevitable.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            10. CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS
          </Text>
          <Text style={styles.text}>
            El estudiante autoriza a La Institución para recolectar, almacenar y
            procesar sus datos personales con el fin de gestionar su inscripción
            y participación en el curso, en cumplimiento de la Ley 1581 de 2012
            y sus decretos reglamentarios. Los datos no serán compartidos con
            terceros sin autorización expresa del estudiante, salvo en los casos
            previstos por la ley.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            11. RESOLUCIÓN DE CONFLICTOS Y CLÁUSULA COMPROMISORIA
          </Text>
          <Text style={styles.text}>
            Cualquier controversia derivada de la interpretación, ejecución o
            terminación del presente contrato será resuelta mediante
            conciliación ante un Centro de Conciliación autorizado en Colombia.
            Si no se llega a un acuerdo, las partes podrán acudir a un tribunal
            de arbitramento de conformidad con la legislación colombiana
            vigente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            12. RESPONSABILIDAD Y CONDICIONES ADICIONALES
          </Text>
          <Text style={styles.text}>
            La Institución se compromete a brindar los contenidos, recursos y
            metodología pedagógica adecuados para el desarrollo del curso. Sin
            embargo, el avance y éxito del estudiante{" "}
            <Text style={styles.bold}>dependerán</Text> de su esfuerzo y
            compromiso.
          </Text>
          <Text style={styles.text}>
            El estudiante acepta que este contrato no garantiza la obtención de
            certificaciones oficiales fuera de las otorgadas por La Institución
            ni el acceso automático a niveles superiores sin cumplir con los
            requisitos de evaluación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. ACEPTACIÓN DE TÉRMINOS</Text>
          <Text style={styles.text}>
            Al firmar este contrato, el estudiante declara haber leído,
            comprendido y aceptado las condiciones aquí establecidas. Así mismo,
            reconoce que La Institución opera bajo la normativa educativa
            colombiana y acatará cualquier reglamento interno vigente.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.text}>Firmas:</Text>

          <View style={styles.signatureLine}></View>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Estudiante: </Text>
            <Text style={getDynamicFieldStyle()}>{data.studentName}</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Documento de Identidad: </Text>
            <Text style={getDynamicFieldStyle()}>{data.documentId}</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.dynamicLabel}>Fecha: </Text>
            <Text>____________________</Text>
          </Text>

          <View style={styles.signatureLine}></View>
          <Text style={styles.text}>
            <Text style={styles.bold}>Representante de La Institución:</Text>{" "}
            Maria Paula Galeano Casas
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>C.C.:</Text> 1020727913
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Fecha:</Text> {currentDate}
          </Text>
        </View>

        {/* Placeholder for Page Number - requires more complex setup */}
        {/* <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed /> */}
      </Page>
    </Document>
  );
};
