import React from "react";

export default function ProposalAccepted() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            ¡Propuesta Aceptada!
          </h1>
          <p className="text-gray-600">
            Gracias por aceptar la propuesta. Nos pondremos en contacto con
            usted a la brevedad para coordinar los siguientes pasos.
          </p>
        </div>
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
