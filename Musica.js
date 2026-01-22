// --- LÓGICA EXISTENTE DE MÚSICA ---
const music = document.getElementById("music");
const btn = document.getElementById("muteBtn");
const icon = document.getElementById("muteIcon");

if (music) { // Verificamos si los elementos existen en la página actual
    music.volume = 0.3;
    let isMuted = localStorage.getItem("muted") === "false" ? false : true;
    music.muted = isMuted;

    if (icon) {
        icon.src = isMuted
            ? "./assets/projectImages/muteIcon.png"
            : "./assets/projectImages/unmuteIcon.png";
    }

    btn?.addEventListener("click", () => {
        isMuted = !isMuted;
        music.muted = isMuted;
        localStorage.setItem("muted", isMuted);
        if (icon) {
            icon.src = isMuted
                ? "./assets/projectImages/muteIcon.png"
                : "./assets/projectImages/unmuteIcon.png";
        }
        if (!isMuted) music.play();
    });
}

// --- NUEVA LÓGICA PARA EL HALL OF FAME ---
const hallImage = document.querySelector(".hallFameBackground");

// Solo se ejecuta si la imagen existe (evita errores en index.html)
if (hallImage) {
    const audioMomo = new Audio('./assets/sounds/me-llama-momo.mp3');

    hallImage.addEventListener("click", (event) => {
        // Usamos offsetX y offsetY como indica la captura de tu profe
        const anchoTotal = hallImage.clientWidth;
        const altoTotal = hallImage.clientHeight;

        // Calculamos porcentaje relativo a la imagen
        const xPct = (event.offsetX / anchoTotal) * 100;
        const yPct = (event.offsetY / altoTotal) * 100;

        console.log(`X: ${xPct.toFixed(2)}%, Y: ${yPct.toFixed(2)}%`);

        // TERCER CUADRO (Momo)
        // Rangos ajustados basados en tus coordenadas previas
        if (xPct >= 51 && xPct <= 63 && yPct >= 34 && yPct <= 51) {
            audioMomo.currentTime = 0;
            audioMomo.play();
        }
    });
}