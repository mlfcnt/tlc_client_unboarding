# Sistema de Gestión de Clases

Una aplicación simple para la gestión de clases de inglés, que facilita la comunicación entre el equipo de ventas y los administradores.

## Características

- Autenticación segura con Clerk
- Panel de administrador para gestionar pruebas, horarios y pagos
- Panel de ventas para registrar clientes y solicitar pruebas
- Interfaz en español
- Diseño responsive

## Tecnologías utilizadas

- Next.js 15
- React 19
- Tailwind CSS 4
- Clerk para autenticación
- Vercel para despliegue

## Configuración

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Crea una cuenta en [Clerk](https://clerk.dev) y configura una aplicación
4. Copia las claves API de Clerk en el archivo `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
   CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Despliegue en Vercel

La forma más sencilla de desplegar esta aplicación es utilizando [Vercel](https://vercel.com):

1. Crea una cuenta en Vercel
2. Importa este repositorio
3. Configura las variables de entorno en Vercel con las claves API de Clerk
4. ¡Listo! Tu aplicación estará desplegada en Vercel

## Flujo de trabajo

1. El equipo de ventas habla con el cliente potencial
2. El equipo de ventas solicita una prueba al administrador
3. El administrador envía la prueba al cliente
4. El administrador notifica al equipo de ventas cuando la prueba está completada
5. El administrador notifica al equipo de ventas sobre la disponibilidad de horarios y fechas de inicio
6. El equipo de ventas proporciona esta información al cliente
7. El cliente confirma o rechaza
8. Si confirma, el administrador envía un enlace para el pago y detalles de la cuenta
9. El cliente realiza el pago y envía la información al administrador

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
