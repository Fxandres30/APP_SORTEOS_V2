import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm";

export function initCompartirNumeros() {

  const btn = document.getElementById("btnCompartirNumeros");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    const contenedor = document.querySelector(".numeros-container");
    if (!contenedor) return;

    const canvas = await html2canvas(contenedor, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    canvas.toBlob(async (blob) => {

      const file = new File([blob], "numeros.png", {
        type: "image/png"
      });

      const texto = `📊 Estado actual de números

Revisa la disponibilidad actual 👀`;

      try {

        // 🔥 CASO 1: Soporta compartir archivos
        if (navigator.canShare && navigator.canShare({ files: [file] })) {

          await navigator.share({
            title: "Estado de números",
            text: texto,
            files: [file]
          });

        } 
        // 🔥 CASO 2: Solo soporta texto
        else if (navigator.share) {

          await navigator.share({
            title: "Estado de números",
            text: texto
          });

        } 
        // 🔥 CASO 3: No soporta nada
        else {
          alert("Tu dispositivo no soporta compartir.");
        }

      } catch (error) {
        console.error("Error al compartir:", error);
      }

    });

  });

}