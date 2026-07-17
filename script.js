/* ============================================================================
   MON AGENDA PÉDAGO — MAIN APPLICATION LOGIC
   Settings, UI interactions, rendering orchestration, localStorage
   ============================================================================ */

// =================================================================
// GLOBAL SETTINGS OBJECT
// =================================================================
const settings = {
  niveau: "6",
  notes: "sous",
  minical: "oui",
  palette: "pastel",
  customColors: ["#e3d9f5", "#fbdccb", "#cbe8de", "#faeab8", "#f6d3d9"],
};

// =================================================================
// APPLY PALETTE TO CSS VARIABLES
// =================================================================

/**
 * Update root CSS variables based on palette setting
 */
function applyPaletteVars() {
  const root = document.documentElement.style;

  if (settings.palette === "nb") {
    // Noir et blanc
    ["--a1", "--a2", "--a3", "--a4", "--a5"].forEach((v) =>
      root.setProperty(v, "#ffffff")
    );
  } else if (settings.palette === "perso") {
    // Personnalisée
    root.setProperty("--a1", settings.customColors[0]);
    root.setProperty("--a2", settings.customColors[1]);
    root.setProperty("--a3", settings.customColors[2]);
    root.setProperty("--a4", settings.customColors[3]);
    root.setProperty("--a5", settings.customColors[4]);
  } else {
    // Pastel (default)
    root.setProperty("--a1", "#e3d9f5");
    root.setProperty("--a2", "#fbdccb");
    root.setProperty("--a3", "#cbe8de");
    root.setProperty("--a4", "#faeab8");
    root.setProperty("--a5", "#f6d3d9");
  }
}

/**
 * Get current palette as hex colors (for DOCX export)
 */
function currentPaletteHex() {
  if (settings.palette === "nb") {
    return {
      conge: "FFFFFF",
      pedagogique: "FFFFFF",
      personnel: "FFFFFF",
      rentree: "FFFFFF",
      special: "FFFFFF",
    };
  }

  if (settings.palette === "perso") {
    return {
      rentree: settings.customColors[0].replace("#", "").toUpperCase(),
      special: settings.customColors[1].replace("#", "").toUpperCase(),
      personnel: settings.customColors[2].replace("#", "").toUpperCase(),
      pedagogique: settings.customColors[3].replace("#", "").toUpperCase(),
      conge: settings.customColors[4].replace("#", "").toUpperCase(),
    };
  }

  return CAT_HEX_DEFAULT;
}

// =================================================================
// UI INTERACTION: PILL GROUPS
// =================================================================

/**
 * Wire up a pill group for exclusive selection
 */
function wirePillGroup(groupId, onSelect) {
  const group = document.getElementById(groupId);
  group.querySelectorAll(".pill").forEach((p) => {
    p.addEventListener("click", () => {
      group.querySelectorAll(".pill").forEach((x) => x.classList.remove("active"));
      p.classList.add("active");
      onSelect(p.dataset.val);
      rerender();
    });
  });
}

// Wire up all pill groups
wirePillGroup("niveau-options", (v) => (settings.niveau = v));
wirePillGroup("notes-options", (v) => (settings.notes = v));
wirePillGroup("minical-options", (v) => (settings.minical = v));
wirePillGroup("palette-options", (v) => {
  settings.palette = v;
  document.getElementById("perso-controls").style.display =
    v === "perso" ? "flex" : "none";
});

// Color picker inputs (for perso mode)
["c1", "c2", "c3", "c4", "c5"].forEach((id, i) => {
  document.getElementById(id).addEventListener("input", (e) => {
    settings.customColors[i] = e.target.value;
    rerender();
  });
});

// =================================================================
// RENDERING & STATE MANAGEMENT
// =================================================================

/**
 * Re-render preview and apply palette
 */
function rerender() {
  applyPaletteVars();
  const weeks = schoolWeeks();
  if (weeks.length > 0) {
    document.getElementById("preview-target").innerHTML = renderWeek(weeks[0], 0);
  }
}

/**
 * Generate full 42-week calendar
 */
function generateFullYear() {
  applyPaletteVars();
  const weeks = schoolWeeks();
  let all = "";
  weeks.forEach((w, i) => {
    all += renderWeek(w, i);
  });
  document.getElementById("full-year-target").innerHTML = all;
  document.getElementById("export-card").style.display = "block";
}

// =================================================================
// EVENT LISTENERS
// =================================================================

document.getElementById("gen-btn").addEventListener("click", () => {
  generateFullYear();
  document.getElementById("gen-btn").textContent =
    "✓ 42 semaines générées plus bas — régénérer";
  document.getElementById("full-year-target").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("print-btn").addEventListener("click", () => window.print());

// =================================================================
// SAVE / LOAD FUNCTIONALITY (localStorage + JSON download)
// =================================================================

/**
 * Collect all textarea and input values from the full year target
 */
function collectFieldValues() {
  const data = {};

  document.querySelectorAll("#full-year-target textarea").forEach((el) => {
    data[el.id] = el.value;
  });

  document.querySelectorAll("#full-year-target input[type=text]").forEach((el) => {
    data[el.id] = el.value;
  });

  return data;
}

/**
 * Apply previously collected field values back to the form
 */
function applyFieldValues(data) {
  Object.keys(data).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = data[id];
  });
}

// Save button: export to JSON file
document.getElementById("save-btn").addEventListener("click", () => {
  const payload = {
    settings,
    fields: collectFieldValues(),
    savedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mon-agenda-pedago-sauvegarde.json";
  link.click();
});

// Load button: open file picker
document.getElementById("load-btn").addEventListener("click", () => {
  document.getElementById("load-file").click();
});

// Load file: parse JSON and restore state
document.getElementById("load-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);

      // Restore settings
      Object.assign(settings, payload.settings);

      // Update UI to reflect restored settings
      document
        .querySelectorAll("#niveau-options .pill")
        .forEach((p) =>
          p.classList.toggle("active", p.dataset.val === settings.niveau)
        );
      document
        .querySelectorAll("#notes-options .pill")
        .forEach((p) =>
          p.classList.toggle("active", p.dataset.val === settings.notes)
        );
      document
        .querySelectorAll("#minical-options .pill")
        .forEach((p) =>
          p.classList.toggle("active", p.dataset.val === settings.minical)
        );
      document
        .querySelectorAll("#palette-options .pill")
        .forEach((p) =>
          p.classList.toggle("active", p.dataset.val === settings.palette)
        );

      document.getElementById("perso-controls").style.display =
        settings.palette === "perso" ? "flex" : "none";

      ["c1", "c2", "c3", "c4", "c5"].forEach((id, i) => {
        document.getElementById(id).value = settings.customColors[i];
      });

      rerender();
      generateFullYear();
      applyFieldValues(payload.fields || {});

      document.getElementById("gen-btn").textContent =
        "✓ Enregistrement repris — régénérer";
      alert("Votre planner a été repris avec succès.");
    } catch (err) {
      alert("Ce fichier n'a pas pu être lu : " + err.message);
    }
  };

  reader.readAsText(file);
});

// =================================================================
// INITIALIZATION
// =================================================================

// Render initial preview on page load
rerender();
