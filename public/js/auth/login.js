import { supabase } from "../services/supabase.js";

/* ===================================== */
/* ===== ELEMENTOS DOM ================= */
/* ===================================== */
const btn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");
const togglePass = document.getElementById("togglePass");
const passwordInput = document.getElementById("password");
const formMsg = document.getElementById("formMsg");

/* ===================================== */
/* ===== AUTO LOGIN SI YA HAY SESIÓN === */
/* ===================================== */
document.addEventListener("DOMContentLoaded", async () => {

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    window.location.href = "dashboard.html";
  }

});

/* ===================================== */
/* ===== MOSTRAR MENSAJE =============== */
/* ===================================== */
function showMessage(message, type = "error") {
  if (!formMsg) return;
  formMsg.textContent = message;
  formMsg.className = "form-msg " + type;
}

/* ===================================== */
/* ===== TOGGLE PASSWORD =============== */
/* ===================================== */
if (togglePass) {
  togglePass.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePass.textContent = isPassword ? "Ocultar" : "Ver";
  });
}

/* ===================================== */
/* ===== LOGIN NORMAL ================== */
/* ===================================== */
btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Completa todos los campos");
    return;
  }

  try {

    btn.classList.add("loading");
    btn.disabled = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showMessage(error.message);
      return;
    }

    // 🔥 Redirigir si login correcto
    window.location.href = "dashboard.html";

  } catch (err) {
    showMessage("Error inesperado");
  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;
  }

});

/* ===================================== */
/* ===== LOGIN CON GOOGLE ============== */
/* ===================================== */
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard.html"
      }
    });

    if (error) {
      showMessage(error.message);
    }
  });
}

/* ===================================== */
/* ===== RECUPERAR CONTRASEÑA ========== */
/* ===================================== */
const recoverLink = document.getElementById("recoverPassword");

if (recoverLink) {
  recoverLink.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    if (!email) {
      showMessage("Ingresa tu correo primero");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset.html"
    });

    if (error) {
      showMessage(error.message);
    } else {
      showMessage("Correo enviado 📩", "success");
    }
  });
}

/* ===================================== */
/* ===== ESCUCHAR CAMBIOS DE SESIÓN ==== */
/* ===================================== */
supabase.auth.onAuthStateChange((event, session) => {

  if (event === "SIGNED_OUT") {
    window.location.href = "index.html";
  }

});