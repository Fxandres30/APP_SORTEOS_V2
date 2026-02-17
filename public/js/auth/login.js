import { supabase } from "../services/supabase.js";

const btn = document.getElementById("loginBtn");

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  window.location.href = "dashboard.html";
});
