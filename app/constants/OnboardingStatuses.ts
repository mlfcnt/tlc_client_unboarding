export const OnboardingStatuses = {
  test_requested: "Prueba solicitada",
  test_sent: "Prueba enviada",
  test_done: "Prueba completada",
  notified_level_sales: "Nivel de ventas notificado",
  notified_level_user: "Nivel de usuario notificado",
  awaiting_payment_link: "Esperando enlace de pago",
  refused_schedule: "Horario rechazado",
  payed: "Pagado",
  denied_payment: "Pago denegado",
  not_started: "No iniciado",
} as const;

// Utility function to get the key from a value
export const getKeyFromValue = (
  value: string
): keyof typeof OnboardingStatuses | undefined => {
  const entries = Object.entries(OnboardingStatuses);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = entries.find(([_, val]) => val === value);
  return entry ? (entry[0] as keyof typeof OnboardingStatuses) : undefined;
};

// Utility function to get all keys
export const getOnboardingStatusKeys =
  (): (keyof typeof OnboardingStatuses)[] => {
    return Object.keys(
      OnboardingStatuses
    ) as (keyof typeof OnboardingStatuses)[];
  };
