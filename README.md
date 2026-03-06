
# 📱 MB FOCUS - Guía de Inicio Rápido

¡Bienvenido a tu nueva aplicación de productividad! Para que tu app sea funcional, debes activar los servicios en tu panel de Firebase.

## 🛠️ PASO CRUCIAL: Activar Firebase (Solo una vez)

Sin esto, la app se verá pero los botones no guardarán nada:

1. **Entra en [Firebase Console](https://console.firebase.google.com/)**.
2. **Selecciona tu proyecto**.
3. **Authentication**:
   - En el menú izquierdo ve a **"Build"** -> **"Authentication"**.
   - Haz clic en **"Get Started"** (Comenzar).
   - Ve a la pestaña **"Sign-in method"**.
   - Busca **"Anonymous"** (Anónimo) al final de la lista.
   - Dale a **"Enable"** (Habilitar) y luego a **"Save"** (Guardar).
4. **Firestore Database**:
   - Ve a **"Firestore Database"** -> **"Create database"**.
   - Selecciona una ubicación cercana y elige **"Start in production mode"**.
   - Ve a la pestaña **"Rules"** (Reglas) y asegúrate de que las reglas coincidan con las de tu archivo `firestore.rules` del proyecto.

---

## 🚀 Cómo subir cambios a GitHub

Si ya hiciste el primer paso y quieres actualizar tu app con estas mejoras:

1. Abre la terminal abajo.
2. Escribe: `git add .`
3. Escribe: `git commit -m "Actualización: App funcional con Auth"`
4. Escribe: `git push`

---

## 🌐 Publicar en Vercel

1. **Importa el proyecto** desde GitHub en Vercel.
2. **IMPORTANTE**: En "Environment Variables", añade:
   - Key: `GOOGLE_GENAI_API_KEY`
   - Value: (Tu clave de API de Gemini).
3. **Deploy**.

## 🛠️ Tecnologías
- **Next.js / React / Tailwind**
- **Firebase Auth & Firestore**
- **Genkit (IA para Compras)**
