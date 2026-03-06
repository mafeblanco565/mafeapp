
# 📱 MB FOCUS - Guía de Inicio Rápido

¡Bienvenido a tu nueva aplicación de productividad! Para que tu app sea funcional, debes activar los servicios en tu panel de Firebase.

## 🛠️ PASO CRUCIAL: Activar Firebase (Solo una vez)

Sin esto, la app se verá pero los botones no guardarán nada:

1. **Entra en [Firebase Console](https://console.firebase.google.com/)**.
2. **Authentication**:
   - Ve a "Authentication" -> "Get Started".
   - En "Sign-in method", activa **"Anonymous"** (Anónimo) y dale a guardar.
3. **Firestore Database**:
   - Ve a "Firestore Database" -> "Create database".
   - Selecciona una ubicación cercana y elige **"Start in production mode"**.
   - Ve a la pestaña **"Rules"** (Reglas) y asegúrate de que las reglas coincidan con las de tu archivo `firestore.rules` del proyecto.

---

## 🚀 Paso 1: Subir tu app a GitHub

Si te aparece el error "remote origin already exists", ejecuta:

1. `git remote remove origin`
2. `git remote add origin https://github.com/mafeblanco565/TU_REPOSITORIO.git`
3. `git add .`
4. `git commit -m "App funcional con Auth"`
5. `git push -u origin main`

---

## 🌐 Paso 2: Publicar en Vercel

1. **Importa el proyecto** desde GitHub en Vercel.
2. **IMPORTANTE**: En "Environment Variables", añade:
   - Key: `GOOGLE_GENAI_API_KEY`
   - Value: (Tu clave de API de Gemini).
3. **Deploy**.

## 🛠️ Tecnologías
- **Next.js / React / Tailwind**
- **Firebase Auth & Firestore**
- **Genkit (IA para Compras)**
