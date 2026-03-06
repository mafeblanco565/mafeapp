# 📱 MB FOCUS - Guía de Inicio Rápido

¡Bienvenido a tu nueva aplicación de productividad! Tu código ya está en GitHub y listo para usarse.

## 🛠️ PASOS FINALES: Activar tu base de datos

Para que la app guarde tus datos (tareas, facturas, etc.), debes hacer estos dos pasos en tu consola de Firebase:

1. **Activar Autenticación Anónima**:
   - Ve a [Firebase Console](https://console.firebase.google.com/).
   - Entra en **Build** -> **Authentication** -> **Sign-in method**.
   - Busca **"Anonymous"** y dale a **Enable** (Habilitar) y **Save**.

2. **Crear Base de Datos Firestore**:
   - Ve a **Build** -> **Firestore Database**.
   - Haz clic en **Create database**.
   - Elige **"Start in production mode"** y selecciona una ubicación cercana a ti.

---

## 🚀 Cómo actualizar tu App

Cuando hagas cambios en el código y quieras verlos en tu celular, usa estos comandos en la terminal:

1. `git add .`
2. `git commit -m "Descripción de lo que cambiaste"`
3. `git push`

Vercel detectará el cambio y lo publicará en segundos.

---

## 🌐 Despliegue en Vercel

1. Ve a [Vercel](https://vercel.com) e importa tu repositorio `mafeapp`.
2. **IMPORTANTE**: En la sección **Environment Variables**, añade:
   - **Key**: `GOOGLE_GENAI_API_KEY`
   - **Value**: Tu clave de API de Gemini (para que la IA de las compras funcione).
3. Haz clic en **Deploy**.

¡Disfruta de tu nueva herramienta de enfoque! 🎯
