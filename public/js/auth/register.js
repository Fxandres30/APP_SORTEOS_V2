import { supabase } from "../services/supabase.js";

/* ===================================== */
/* ===== GENERAR CÓDIGO DE REFERIDO ==== */
/* ===================================== */
function generarCodigo(nombre) {
  const base = nombre
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);

  return base + Math.floor(100 + Math.random() * 900);
}

/* ===================================== */
/* ===== ELEMENTOS DOM ================= */
/* ===================================== */
const registerBtn = document.getElementById("registerBtn");
const googleBtn = document.getElementById("googleBtn");
const togglePass = document.getElementById("togglePass");
const passwordInput = document.getElementById("password");
const formMsg = document.getElementById("formMsg");

/* ===================================== */
/* ===== MOSTRAR MENSAJE =============== */
/* ===================================== */
function showMessage(message, type = "error") {
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
/* ===== REGISTRO NORMAL =============== */
/* ===================================== */
registerBtn.addEventListener("click", async () => {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  const referralInput = document.getElementById("referralCode").value.trim();

  if (!name || !email || !password) {
    showMessage("Completa todos los campos");
    return;
  }

  try {

    registerBtn.classList.add("loading");
    registerBtn.disabled = true;

    // Crear usuario Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      showMessage(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      showMessage("Revisa tu correo para confirmar tu cuenta", "success");
      return;
    }

    const referralCode = generarCodigo(name);

    // Crear perfil
    await supabase.from("profiles").insert({
      id: user.id,
      name,
      email,
      referral_code: referralCode
    });

    // Procesar referido
    if (referralInput) {
      const { data: refUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", referralInput)
        .single();

      if (refUser) {
        await supabase.from("referrals").insert({
          referrer_id: refUser.id,
          referred_id: user.id
        });
      }
    }

    showMessage("Cuenta creada correctamente 🎉", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (err) {
    showMessage("Ocurrió un error inesperado");
  } finally {
    registerBtn.classList.remove("loading");
    registerBtn.disabled = false;
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
        redirectTo: window.location.origin
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
      showMessage("Ingresa tu correo para recuperar contraseña");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset.html"
    });

    if (error) {
      showMessage(error.message);
    } else {
      showMessage("Correo de recuperación enviado 📩", "success");
    }
  });
}