
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
- **Despliegue**: Optimizado para [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## 📦 Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone [URL-DE-TU-REPOSITORIO]
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Configura tus credenciales de Firebase en `src/firebase/config.ts` y asegúrate de tener una `GOOGLE_GENAI_API_KEY` válida si ejecutas Genkit localmente.

4. **Desarrollo:**
   ```bash
   npm run dev
   ```

## 📱 Optimización Móvil

La aplicación ha sido construida con un enfoque **Mobile-First**, utilizando una navegación por menú de hamburguesa superior y controles accesibles para el uso con una sola mano.
