export const processSteps = [
  {
    id: 1,
    name: "Initial Contact",
    owner: "sales",
    description: "Sales team makes initial contact with the student",
    salesActions: ["Schedule intro call", "Send course materials"],
    adminActions: [],
  },
  {
    id: 2,
    name: "Needs Assessment",
    owner: "sales",
    description: "Sales team assesses student's English level and goals",
    salesActions: ["Complete assessment form", "Document requirements"],
    adminActions: [],
  },
  {
    id: 3,
    name: "Course Selection",
    owner: "sales",
    description: "Sales team helps student select appropriate course",
    salesActions: ["Present course options", "Get internal approval"],
    adminActions: ["Check class availability", "Verify pricing"],
  },
  {
    id: 4,
    name: "Admin Review",
    owner: "admin",
    description: "Admin team reviews and validates the enrollment",
    salesActions: [],
    adminActions: ["Validate student details", "Prepare enrollment documents"],
  },
  {
    id: 5,
    name: "Payment Processing",
    owner: "sales",
    description: "Sales team processes payment for the course",
    salesActions: ["Send invoice", "Confirm payment receipt"],
    adminActions: [],
  },
  {
    id: 6,
    name: "Class Scheduling",
    owner: "admin",
    description: "Admin team schedules classes for the student",
    salesActions: [],
    adminActions: ["Assign teacher", "Create class schedule"],
  },
  {
    id: 7,
    name: "Learning Materials",
    owner: "sales",
    description: "Sales team provides learning materials to student",
    salesActions: ["Send textbooks/materials", "Explain resources"],
    adminActions: ["Prepare digital access"],
  },
  {
    id: 8,
    name: "Tech Setup",
    owner: "sales",
    description: "Student completes technical setup for online classes",
    salesActions: ["Guide through platform setup", "Test connection"],
    adminActions: [],
  },
  {
    id: 9,
    name: "Teacher Assignment",
    owner: "admin",
    description: "Admin team finalizes teacher assignment",
    salesActions: [],
    adminActions: ["Match with appropriate teacher", "Share student profile"],
  },
  {
    id: 10,
    name: "Orientation",
    owner: "admin",
    description: "Admin team conducts orientation session",
    salesActions: ["Follow up after orientation"],
    adminActions: ["Schedule orientation", "Explain class procedures"],
  },
  {
    id: 11,
    name: "First Class Prep",
    owner: "sales",
    description: "Final preparations before first English class",
    salesActions: ["Send reminder", "Address last-minute questions"],
    adminActions: ["Confirm all systems ready"],
  },
];
