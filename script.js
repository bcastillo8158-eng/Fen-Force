/* =========================================================
   FENÓMENO DEL NIÑO - APP
   JavaScript completo
========================================================= */


/* =========================================================
   ESTADO GENERAL
========================================================= */

const appState = {
  currentSection: "inicio",
  favorites: JSON.parse(localStorage.getItem("fenomenoFavorites") || "[]"),
  darkMode: localStorage.getItem("fenomenoDarkMode") === "true",
  kit: JSON.parse(localStorage.getItem("fenomenoKit") || "[]"),
  currentRegion: null
};


/* =========================================================
   ELEMENTOS
========================================================= */

const body = document.body;

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const openSidebarButton = document.getElementById("openSidebar");
const closeSidebarButton = document.getElementById("closeSidebar");

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".app-section");

const pageTitle = document.getElementById("pageTitle");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

const globalSearch = document.getElementById("globalSearch");
const searchPanel = document.getElementById("searchPanel");
const searchResults = document.getElementById("searchResults");
const closeSearchButton = document.getElementById("closeSearch");

const aboutButton = document.getElementById("aboutButton");
const aboutModal = document.getElementById("aboutModal");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

const currentDate = document.getElementById("currentDate");


/* =========================================================
   NOMBRES DE LAS SECCIONES
========================================================= */

const sectionNames = {
  inicio: "Inicio",
  informacion: "Información",
  causas: "Causas",
  consecuencias: "Consecuencias",
  mapa: "Mapa de riesgos",
  prevencion: "Prevención",
  mochila: "Mochila de emergencia",
  alertas: "Alertas",
  galeria: "Galería",
  quiz: "Quiz educativo",
  glosario: "Glosario",
  fuentes: "Fuentes"
};


/* =========================================================
   NAVEGACIÓN
========================================================= */

function showSection(sectionId) {

  if (!sectionNames[sectionId]) {
    return;
  }

  appState.currentSection = sectionId;

  sections.forEach(section => {
    section.classList.toggle(
      "active-section",
      section.id === sectionId
    );
  });

  navItems.forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.section === sectionId
    );
  });

  pageTitle.textContent = sectionNames[sectionId];

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  closeMobileSidebar();
}

navItems.forEach(item => {

  item.addEventListener("click", () => {

    const section = item.dataset.section;

    showSection(section);

  });

});


/* =========================================================
   BOTONES data-go
========================================================= */

document.querySelectorAll("[data-go]").forEach(button => {

  button.addEventListener("click", () => {

    const destination = button.dataset.go;

    showSection(destination);

  });

});


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function openMobileSidebar() {

  sidebar.classList.add("mobile-open");
  sidebarOverlay.classList.add("active");

}

function closeMobileSidebar() {

  sidebar.classList.remove("mobile-open");
  sidebarOverlay.classList.remove("active");

}

openSidebarButton.addEventListener("click", openMobileSidebar);

closeSidebarButton.addEventListener("click", closeMobileSidebar);

sidebarOverlay.addEventListener("click", closeMobileSidebar);


/* =========================================================
   MODO OSCURO
========================================================= */

function applyTheme() {

  body.classList.toggle("dark", appState.darkMode);

  if (appState.darkMode) {

    themeIcon.textContent = "☀";
    themeText.textContent = "Modo claro";

  } else {

    themeIcon.textContent = "☾";
    themeText.textContent = "Modo oscuro";

  }

  localStorage.setItem(
    "fenomenoDarkMode",
    String(appState.darkMode)
  );

}

themeToggle.addEventListener("click", () => {

  appState.darkMode = !appState.darkMode;

  applyTheme();

  showToast(
    appState.darkMode
      ? "Modo oscuro activado"
      : "Modo claro activado"
  );

});

applyTheme();


/* =========================================================
   FECHA
========================================================= */

function updateDate() {

  const now = new Date();

  const formatted = new Intl.DateTimeFormat(
    "es-PE",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(now);

  currentDate.textContent =
    formatted.charAt(0).toUpperCase() +
    formatted.slice(1);

}

updateDate();


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

  toastText.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2400);

}


/* =========================================================
   FAVORITOS
========================================================= */

function saveFavorites() {

  localStorage.setItem(
    "fenomenoFavorites",
    JSON.stringify(appState.favorites)
  );

}

function toggleFavorite(name, button) {

  const index = appState.favorites.indexOf(name);

  if (index >= 0) {

    appState.favorites.splice(index, 1);

    if (button) {
      button.textContent = "☆";
    }

    showToast("Quitado de favoritos");

  } else {

    appState.favorites.push(name);

    if (button) {
      button.textContent = "★";
    }

    showToast("Guardado en favoritos");

  }

  saveFavorites();

}

document.querySelectorAll(".card-favorite").forEach(button => {

  const name = button.dataset.fav;

  if (appState.favorites.includes(name)) {
    button.textContent = "★";
  }

  button.addEventListener("click", () => {

    toggleFavorite(name, button);

  });

});


/* =========================================================
   FAVORITOS DEL HEADER
========================================================= */

const favoriteButton =
  document.getElementById("favoriteButton");

favoriteButton.addEventListener("click", () => {

  if (appState.favorites.length === 0) {

    showToast("Todavía no tienes favoritos");

    return;
  }

  showToast(
    `${appState.favorites.length} favorito(s) guardado(s)`
  );

});


/* =========================================================
   MODAL
========================================================= */

function openModal() {

  aboutModal.classList.remove("hidden");

  document.body.style.overflow = "hidden";

}

function closeModal() {

  aboutModal.classList.add("hidden");

  document.body.style.overflow = "";

}

aboutButton.addEventListener("click", openModal);

document.querySelectorAll("[data-close-modal]").forEach(element => {

  element.addEventListener("click", closeModal);

});


/* =========================================================
   BUSCADOR GLOBAL
========================================================= */

const searchDatabase = [

  {
    section: "informacion",
    category: "Información",
    title: "¿Qué es el Fenómeno del Niño?",
    text: "Explicación del fenómeno y la interacción entre océano y atmósfera."
  },

  {
    section: "causas",
    category: "Causas",
    title: "Cambios del océano",
    text: "Variaciones de temperatura superficial del Pacífico."
  },

  {
    section: "causas",
    category: "Causas",
    title: "Cambios atmosféricos",
    text: "Cambios en circulación, humedad y precipitación."
  },

  {
    section: "consecuencias",
    category: "Consecuencias",
    title: "Inundaciones",
    text: "Impactos sobre viviendas, vías e infraestructura."
  },

  {
    section: "consecuencias",
    category: "Consecuencias",
    title: "Huaicos",
    text: "Flujos de lodo, rocas y otros materiales."
  },

  {
    section: "prevencion",
    category: "Prevención",
    title: "Prevención familiar",
    text: "Acciones que pueden ayudar a reducir riesgos."
  },

  {
    section: "mochila",
    category: "Preparación",
    title: "Mochila de emergencia",
    text: "Lista de elementos básicos para la preparación."
  },

  {
    section: "mapa",
    category: "Mapa",
    title: "Mapa de riesgos",
    text: "Consulta información educativa por región."
  },

  {
    section: "alertas",
    category: "Alertas",
    title: "Centro de alertas",
    text: "Módulo demostrativo de alertas y recomendaciones."
  },

  {
    section: "glosario",
    category: "Glosario",
    title: "Huaico",
    text: "Definición de huaico y otros términos."
  },

  {
    section: "glosario",
    category: "Glosario",
    title: "Precipitación",
    text: "Agua que cae desde la atmósfera."
  },

  {
    section: "glosario",
    category: "Glosario",
    title: "Vulnerabilidad",
    text: "Condiciones que pueden aumentar el impacto."
  },

  {
    section: "fuentes",
    category: "Fuentes",
    title: "Fuentes oficiales",
    text: "Consulta recursos de organismos oficiales."
  }

];


function renderSearchResults(query) {

  const normalized = query
    .trim()
    .toLowerCase();

  if (!normalized) {

    searchResults.innerHTML = `
      <div class="no-results">
        Escribe una palabra para buscar.
      </div>
    `;

    return;

  }

  const results =
    searchDatabase.filter(item => {

      const content = `
        ${item.category}
        ${item.title}
        ${item.text}
      `.toLowerCase();

      return content.includes(normalized);

    });

  if (results.length === 0) {

    searchResults.innerHTML = `
      <div class="no-results">
        No encontramos resultados para
        "<strong>${escapeHTML(query)}</strong>".
      </div>
    `;

    return;

  }

  searchResults.innerHTML = results
    .slice(0, 10)
    .map(item => {

      return `
        <button
          class="search-result"
          data-search-section="${item.section}"
        >
          <span>${escapeHTML(item.category)}</span>
          <strong>${escapeHTML(item.title)}</strong>
          <p>${escapeHTML(item.text)}</p>
        </button>
      `;

    })
    .join("");

  document
    .querySelectorAll("[data-search-section]")
    .forEach(button => {

      button.addEventListener("click", () => {

        showSection(button.dataset.searchSection);

        searchPanel.classList.add("hidden");

      });

    });

}

globalSearch.addEventListener("input", () => {

  const query = globalSearch.value;

  if (query.trim()) {

    searchPanel.classList.remove("hidden");

    renderSearchResults(query);

  } else {

    searchPanel.classList.add("hidden");

  }

});

closeSearchButton.addEventListener("click", () => {

  searchPanel.classList.add("hidden");

});


document.addEventListener("click", event => {

  const clickedInsideSearch =
    event.target.closest(".search-box") ||
    event.target.closest("#searchPanel");

  if (!clickedInsideSearch) {
    searchPanel.classList.add("hidden");
  }

});


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   MAPA INTERACTIVO
========================================================= */

const regionData = {

  norte: {
    title: "Norte del Perú",
    risk: "Mayor atención",
    phenomenon: "Lluvias intensas",
    advice:
      "Consulta información oficial, evita quebradas y zonas inundables y revisa las rutas de evacuación de tu localidad."
  },

  centro: {
    title: "Centro del Perú",
    risk: "Variable",
    phenomenon: "Lluvias y movimientos de masa",
    advice:
      "La exposición cambia según el terreno y la localidad. Identifica zonas seguras y evita áreas de riesgo."
  },

  sur: {
    title: "Sur del Perú",
    risk: "Variable",
    phenomenon: "Lluvias y cambios climáticos",
    advice:
      "Mantente informado y adapta las medidas de prevención al riesgo específico de tu localidad."
  },

  costa: {
    title: "Costa",
    risk: "Atención",
    phenomenon: "Lluvias e inundaciones",
    advice:
      "Evita cruzar zonas inundadas y revisa las rutas de evacuación y drenaje cercanas."
  },

  sierra: {
    title: "Sierra",
    risk: "Variable",
    phenomenon: "Lluvias y huaicos",
    advice:
      "Aléjate de quebradas y cauces durante lluvias intensas y sigue las recomendaciones oficiales."
  }

};

const regionButtons =
  document.querySelectorAll(".map-region");

const regionInformation =
  document.getElementById("regionInformation");

const regionRisk =
  document.getElementById("regionRisk");

const regionPhenomenon =
  document.getElementById("regionPhenomenon");

const regionAdvice =
  document.getElementById("regionAdvice");

function selectRegion(regionKey) {

  const region = regionData[regionKey];

  if (!region) {
    return;
  }

  appState.currentRegion = regionKey;

  regionButtons.forEach(button => {

    button.classList.toggle(
      "selected",
      button.dataset.region === regionKey
    );

  });

  regionInformation.querySelector("h3").textContent =
    region.title;

  regionInformation.querySelector("p").textContent =
    "Información educativa de referencia para esta zona.";

  regionRisk.textContent =
    region.risk;

  regionPhenomenon.textContent =
    region.phenomenon;

  regionAdvice.textContent =
    region.advice;

  showToast(`Zona seleccionada: ${region.title}`);

}

regionButtons.forEach(button => {

  button.addEventListener("click", () => {

    selectRegion(button.dataset.region);

  });

});


/* =========================================================
   ACORDEÓN
========================================================= */

const accordionHeaders =
  document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {

  header.addEventListener("click", () => {

    const currentItem =
      header.closest(".accordion-item");

    const currentlyOpen =
      currentItem.classList.contains("open");

    document
      .querySelectorAll(".accordion-item")
      .forEach(item => {

        item.classList.remove("open");

      });

    if (!currentlyOpen) {

      currentItem.classList.add("open");

    }

  });

});


/* =========================================================
   MOCHILA DE EMERGENCIA
========================================================= */

const kitCheckboxes =
  document.querySelectorAll(".kit-item input");

const kitPercent =
  document.getElementById("kitPercent");

const kitProgressFill =
  document.getElementById("kitProgressFill");

const resetKitButton =
  document.getElementById("resetKit");


function loadKitState() {

  kitCheckboxes.forEach((checkbox, index) => {

    checkbox.checked =
      appState.kit.includes(index);

  });

  updateKitProgress();

}

function updateKitProgress() {

  const total =
    kitCheckboxes.length;

  const completed =
    [...kitCheckboxes]
      .filter(input => input.checked)
      .length;

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  kitPercent.textContent =
    `${percentage}%`;

  kitProgressFill.style.width =
    `${percentage}%`;

  appState.kit = [...kitCheckboxes]
    .map((checkbox, index) =>
      checkbox.checked ? index : null
    )
    .filter(index => index !== null);

  localStorage.setItem(
    "fenomenoKit",
    JSON.stringify(appState.kit)
  );

}

kitCheckboxes.forEach((checkbox, index) => {

  checkbox.addEventListener("change", () => {

    updateKitProgress();

    if (checkbox.checked) {

      showToast("Elemento agregado a la mochila");

    } else {

      showToast("Elemento retirado de la lista");

    }

  });

});


resetKitButton.addEventListener("click", () => {

  kitCheckboxes.forEach(checkbox => {

    checkbox.checked = false;

  });

  updateKitProgress();

  showToast("Lista reiniciada");

});

loadKitState();


/* =========================================================
   ALERTAS
========================================================= */

const alertDescriptions = {

  Lluvias:
    "Evita desplazarte por zonas inundables, mantente informado y sigue las indicaciones de las autoridades.",

  Inundación:
    "No intentes cruzar corrientes de agua. Busca un lugar seguro y sigue las rutas de evacuación.",

  Preparación:
    "Revisa tu mochila, identifica zonas seguras y conversa con tu familia sobre qué hacer en caso de emergencia."

};

document
  .querySelectorAll(".show-alert-detail")
  .forEach(button => {

    button.addEventListener("click", () => {

      const type = button.dataset.alert;

      showToast(
        alertDescriptions[type] ||
        "Consulta las recomendaciones oficiales."
      );

    });

  });


/* =========================================================
   GLOSARIO
========================================================= */

const glossarySearch =
  document.getElementById("glossarySearch");

const glossaryItems =
  [...document.querySelectorAll(".glossary-item")];

glossarySearch.addEventListener("input", () => {

  const query =
    glossarySearch.value.trim().toLowerCase();

  glossaryItems.forEach(item => {

    const text =
      item.textContent.toLowerCase();

    const visible =
      text.includes(query);

    item.style.display =
      visible ? "" : "none";

  });

});


/* =========================================================
   QUIZ
========================================================= */

const quizQuestions = [

  {
    question:
      "¿Con qué sistema climático está relacionado el Fenómeno del Niño?",

    answers: [
      "Océano Pacífico y atmósfera",
      "Solo los volcanes",
      "Solo los glaciares",
      "Solo los bosques"
    ],

    correct: 0
  },

  {
    question:
      "¿Cuál puede ser una consecuencia de lluvias intensas?",

    answers: [
      "Inundaciones",
      "Disminución de la gravedad",
      "Desaparición del océano",
      "Congelamiento del desierto"
    ],

    correct: 0
  },

  {
    question:
      "¿Qué es importante preparar antes de una emergencia?",

    answers: [
      "Una mochila de emergencia",
      "Una consola de videojuegos",
      "Una piscina",
      "Una bicicleta de carreras"
    ],

    correct: 0
  },

  {
    question:
      "¿Qué debes hacer ante una zona inundada?",

    answers: [
      "Intentar cruzarla rápidamente",
      "Evitarla y buscar una zona segura",
      "Entrar para observar",
      "Acercarte a cables eléctricos"
    ],

    correct: 1
  },

  {
    question:
      "¿Qué fenómeno puede estar relacionado con quebradas durante lluvias intensas?",

    answers: [
      "Huaicos",
      "Auroras",
      "Tornados polares",
      "Nevadas permanentes"
    ],

    correct: 0
  },

  {
    question:
      "¿Dónde debemos consultar alertas reales?",

    answers: [
      "Fuentes oficiales",
      "Rumores",
      "Mensajes anónimos",
      "Publicaciones sin verificar"
    ],

    correct: 0
  },

  {
    question:
      "¿Qué ayuda a reducir el riesgo?",

    answers: [
      "Conocer rutas de evacuación",
      "Ignorar las alertas",
      "Acercarse a los ríos",
      "Esperar la emergencia sin prepararse"
    ],

    correct: 0
  },

  {
    question:
      "¿Los impactos del fenómeno son iguales en todo el Perú?",

    answers: [
      "Sí, siempre son iguales",
      "No, dependen de la zona y otros factores",
      "Solo afectan a Lima",
      "Solo afectan a la sierra"
    ],

    correct: 1
  }

];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

const questionNumber =
  document.getElementById("questionNumber");

const quizProgress =
  document.getElementById("quizProgress");

const questionText =
  document.getElementById("questionText");

const answersContainer =
  document.getElementById("answers");

const nextQuestionButton =
  document.getElementById("nextQuestion");

const quizFeedback =
  document.getElementById("quizFeedback");

const quizCard =
  document.getElementById("quizCard");

const quizResult =
  document.getElementById("quizResult");

const finalScore =
  document.getElementById("finalScore");

const resultMessage =
  document.getElementById("resultMessage");

const restartQuizButton =
  document.getElementById("restartQuiz");


function renderQuestion() {

  const question =
    quizQuestions[quizIndex];

  quizAnswered = false;

  questionNumber.textContent =
    `${quizIndex + 1} / ${quizQuestions.length}`;

  const percentage =
    ((quizIndex + 1) / quizQuestions.length) * 100;

  quizProgress.style.width =
    `${percentage}%`;

  questionText.textContent =
    question.question;

  quizFeedback.textContent =
    "";

  nextQuestionButton.disabled = true;

  nextQuestionButton.style.opacity =
    "0.55";

  answersContainer.innerHTML =
    "";

  question.answers.forEach((answer, index) => {

    const button =
      document.createElement("button");

    button.className =
      "answer-button";

    button.type =
      "button";

    button.textContent =
      answer;

    button.addEventListener("click", () => {

      handleAnswer(
        index,
        button
      );

    });

    answersContainer.appendChild(button);

  });

}


function handleAnswer(selectedIndex, selectedButton) {

  if (quizAnswered) {
    return;
  }

  quizAnswered = true;

  const question =
    quizQuestions[quizIndex];

  const answerButtons =
    [...answersContainer.querySelectorAll(".answer-button")];

  answerButtons.forEach(button => {

    button.disabled = true;

  });

  if (selectedIndex === question.correct) {

    quizScore++;

    selectedButton.classList.add("correct");

    quizFeedback.textContent =
      "Correcto.";

  } else {

    selectedButton.classList.add("wrong");

    answerButtons[question.correct]
      .classList.add("correct");

    quizFeedback.textContent =
      "Respuesta incorrecta. Revisa la opción correcta.";

  }

  nextQuestionButton.disabled =
    false;

  nextQuestionButton.style.opacity =
    "1";

}


nextQuestionButton.addEventListener("click", () => {

  if (!quizAnswered) {
    return;
  }

  quizIndex++;

  if (quizIndex >= quizQuestions.length) {

    finishQuiz();

    return;
  }

  renderQuestion();

});


function finishQuiz() {

  quizCard.classList.add("hidden");

  quizResult.classList.remove("hidden");

  finalScore.textContent =
    `${quizScore}/${quizQuestions.length}`;

  const percentage =
    Math.round(
      (quizScore / quizQuestions.length) * 100
    );

  if (percentage >= 80) {

    resultMessage.textContent =
      `Obtuviste ${percentage}%. Tienes un buen dominio de los conceptos básicos del Fenómeno del Niño y la prevención.`;

  } else if (percentage >= 50) {

    resultMessage.textContent =
      `Obtuviste ${percentage}%. Conoces varios conceptos, pero todavía puedes reforzar algunos temas.`;

  } else {

    resultMessage.textContent =
      `Obtuviste ${percentage}%. Te recomendamos revisar nuevamente las secciones de información y prevención.`;

  }

}


function restartQuiz() {

  quizIndex = 0;

  quizScore = 0;

  quizCard.classList.remove("hidden");

  quizResult.classList.add("hidden");

  renderQuestion();

}

restartQuizButton.addEventListener(
  "click",
  restartQuiz
);

renderQuestion();


/* =========================================================
   TECLA ESCAPE
========================================================= */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    closeModal();

    closeMobileSidebar();

    searchPanel.classList.add("hidden");

  }

});


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener("resize", () => {

  if (window.innerWidth > 980) {

    closeMobileSidebar();

  }

});


/* =========================================================
   INICIO
========================================================= */

showSection("inicio");

console.log(
  "Fenómeno del Niño - Aplicación educativa iniciada correctamente."
);
