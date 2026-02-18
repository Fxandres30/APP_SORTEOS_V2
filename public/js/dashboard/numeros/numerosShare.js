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

      if (navigator.share) {
        await navigator.share({
          title: "Estado de números",
          text: texto,
          files: [file]
        });
      } else {
        alert("Tu dispositivo no soporta compartir imágenes.");
      }

    });

  });

}
