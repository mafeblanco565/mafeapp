
# 📱 MB FOCUS - Guía de Inicio Rápido

¡Bienvenido a tu nueva aplicación de productividad! Esta guía está diseñada para ayudarte a poner tu app en internet (GitHub y Vercel) incluso si no sabes nada de código.

## 🚀 Paso 1: Subir tu app a GitHub (Tu copia de seguridad)

Si te apareció el error "remote origin already exists", sigue estos pasos en la terminal:

1. **Borra la conexión anterior**:
   ```bash
   git remote remove origin
   ```

2. **Crea la conexión correcta**:
   *(Sustituye `TU_REPOSITORIO` por el nombre que le diste en GitHub, por ejemplo: `mb-focus-app`)*
   ```bash
   git remote add origin https://github.com/mafeblanco565/TU_REPOSITORIO.git
   ```

3. **Sube tus archivos**:
   ```bash
   git push -u origin main
   ```

---

## 🌐 Paso 2: Publicar en Vercel (Para usarla en tu móvil)

Vercel hará que tu app tenga una dirección web (como `tu-app.vercel.app`) para que puedas entrar desde tu celular.

1. **Entra en Vercel**: Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. **Importar Proyecto**:
   - Haz clic en **"Add New"** -> **"Project"**.
   - Verás tu repositorio de GitHub. Dale a **"Import"**.
3. **Configuración**:
   - Vercel detectará que es Next.js automáticamente.
   - **IMPORTANTE**: En la sección **"Environment Variables"**, añade esta variable para que funcione la IA:
     - Key: `GOOGLE_GENAI_API_KEY`
     - Value: (Pega aquí tu clave de API de Google Gemini).
4. **Deploy**: Haz clic en el botón azul **"Deploy"**.
5. ¡Listo! En 2 minutos tendrás un link para abrir tu app en el móvil.

## 🛠️ Tecnologías Usadas
- **Next.js**: El motor de la app.
- **Firebase**: La base de datos donde se guardan tus tareas y notas.
- **Genkit/Gemini**: La inteligencia artificial que genera tus listas de compra.
- **Tailwind/Shadcn**: Lo que hace que la app se vea bonita y moderna.
