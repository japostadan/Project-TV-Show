import { getAllEpisodes } from "./episodes.js";

const allEpisodes = getAllEpisodes();
const container = document.getElementById("episodes-container");
const searchInput = document.getElementById("search-input");
const seasonFilter = document.getElementById("season-filter");

// Helper: zero-padded episode code
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <div id="modal-body"></div>
  </div>
`;
document.body.appendChild(modal);

modal.querySelector(".modal-close").addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

function renderEpisodes(episodeList) {
  container.innerHTML = ""; // clear previous

  episodeList.forEach((ep) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const episodeCode = formatEpisodeCode(ep.season, ep.number);

    card.innerHTML = `
      <h2>${ep.name} (${episodeCode})</h2>
      <img src="${ep.image.medium}" alt="${ep.name}">
      <p>${ep.summary}</p>
    `;

    // Attach click for modal
    card.addEventListener("click", () => showModal(ep));

    container.appendChild(card);
  });
}

// ===== Level 100: Search + Filter =====
function setupLevel100() {
  searchInput.style.display = "inline-block";
  seasonFilter.style.display = "inline-block";

  // Populate season dropdown
  const seasons = [...new Set(allEpisodes.map((ep) => ep.season))];
  seasons.forEach((s) => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = `Season ${s}`;
    seasonFilter.appendChild(option);
  });

  function filterEpisodes() {
    const query = searchInput.value.toLowerCase();
    const season = seasonFilter.value;

    const filtered = allEpisodes.filter((ep) => {
      const matchesText =
        ep.name.toLowerCase().includes(query) ||
        ep.summary.toLowerCase().includes(query);
      const matchesSeason = season === "all" || ep.season === Number(season);
      return matchesText && matchesSeason;
    });

    renderEpisodes(filtered);
  }

  searchInput.addEventListener("input", filterEpisodes);
  seasonFilter.addEventListener("change", filterEpisodes);

  // Initial render
  renderEpisodes(allEpisodes);
}

// ===== Initialize Project =====
setupLevel100();
