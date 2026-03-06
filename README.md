
# MB FOCUS - Productividad Móvil con IA

**MB FOCUS** es una aplicación de productividad minimalista diseñada específicamente para dispositivos móviles. Centraliza la gestión de tu vida diaria integrando tareas, finanzas, hábitos y notas en una interfaz profesional y fluida.

## 🚀 Características Principales

- **Dashboard Inteligente**: Un vistazo rápido a tus tareas pendientes y facturas por pagar.
- **Agenda Semanal**: Calendario visual estilo profesional con bloques de tiempo para una organización precisa.
- **IA Grocery Assistant**: Genera listas de compras temáticas (ej. "Cena Italiana") usando Google Genkit y Gemini.
- **Gestión Financiera**: Seguimiento de facturas y fechas de vencimiento.
- **Tracker de Hábitos**: Sistema diario para construir disciplina.
- **Notas Rápidas**: Captura inspiración al instante.

## 🛠️ Tecnologías

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Base de Datos & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **IA**: [Google Genkit](https://firebase.google.com/docs/genkit) con Gemini 2.5 Flash.
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/).

## 📱 Optimización Móvil

La aplicación utiliza un enfoque **Mobile-First** con navegación por menú de hamburguesa superior y controles accesibles para el uso con una sola mano.

## 🚀 Despliegue en Vercel

1. **Sube tu código a GitHub**.
2. **Conecta tu repositorio en Vercel**: Ve a [Vercel](https://vercel.com/) e importa tu proyecto.
3. **Variables de Entorno**: Asegúrate de añadir las siguientes variables en el panel de Vercel si decides no usar el archivo `src/firebase/config.ts` directamente:
   - `GOOGLE_GENAI_API_KEY`: Tu clave de API para Gemini.
4. **Build Settings**: Vercel detectará automáticamente que es un proyecto de Next.js.

## 📦 Desarrollo Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```
