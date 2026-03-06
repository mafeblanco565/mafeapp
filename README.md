
# 📱 MB FOCUS - Guía de Inicio Rápido

¡Bienvenido a tu nueva aplicación de productividad! Esta guía está diseñada para ayudarte a poner tu app en internet (GitHub y Vercel) incluso si no sabes nada de código.

## 🚀 Paso 1: Subir tu app a GitHub (Tu copia de seguridad)

GitHub es donde guardaremos tu código de forma segura.

1. **Crea una cuenta**: Ve a [github.com](https://github.com) y regístrate.
2. **Crea un repositorio nuevo**: 
   - Haz clic en el botón **"+"** arriba a la derecha -> **"New repository"**.
   - Nombre: `mb-focus-app`.
   - **No marques ninguna casilla** (ni README, ni .gitignore).
   - Haz clic en **"Create repository"**.
3. **Copia los comandos**: En la terminal de este editor, pega estos comandos uno a uno (sustituyendo la URL por la que te dé GitHub):
   ```bash
   git init
   git add .
   git commit -m "Versión inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

## 🌐 Paso 2: Publicar en Vercel (Para usarla en tu móvil)

Vercel hará que tu app tenga una dirección web (como `tu-app.vercel.app`) para que puedas entrar desde tu celular.

1. **Entra en Vercel**: Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. **Importar Proyecto**:
   - Haz clic en **"Add New"** -> **"Project"**.
   - Verás tu repositorio de GitHub `mb-focus-app`. Dale a **"Import"**.
3. **Configuración**:
   - No toques nada en la configuración del proyecto, Vercel detecta que es Next.js automáticamente.
   - **IMPORTANTE**: En la sección **"Environment Variables"**, añade una variable:
     - Key: `GOOGLE_GENAI_API_KEY`
     - Value: (Tu clave de API de Google Gemini para que funcione la IA).
4. **Deploy**: Haz clic en el botón azul **"Deploy"**.
5. ¡Listo! En 2 minutos tendrás un link para abrir tu app en el móvil.

## 🛠️ Tecnologías Usadas
- **Next.js**: El motor de la app.
- **Firebase**: La base de datos donde se guardan tus tareas y notas.
- **Genkit/Gemini**: La inteligencia artificial que genera tus listas de compra.
- **Tailwind/Shadcn**: Lo que hace que la app se vea bonita y moderna.
