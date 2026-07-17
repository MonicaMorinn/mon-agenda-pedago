/* ============================================================================
   MON AGENDA PÉDAGO — CALENDAR DATA & RENDERING LOGIC
   42 weeks school calendar 2026-2027, DSFS events
   ============================================================================ */

// =================================================================
// CALENDAR EVENTS — DSFS Moncton, 2026-2027
// =================================================================
const CALENDAR_EVENTS = [
  // August / September 2026
  { date: "2026-08-31", cat: "personnel", label: "Journée administrative" },
  { date: "2026-09-01", cat: "personnel", label: "Perfectionnement AEFNB" },
  { date: "2026-09-02", cat: "pedagogique", label: "Journée de PAQ" },
  { date: "2026-09-03", end: "2026-09-04", cat: "personnel", label: "Journée administrative" },
  { date: "2026-09-07", cat: "conge", label: "Fête du Travail" },
  { date: "2026-09-08", cat: "rentree", label: "1ère journée (6e)!" },
  { date: "2026-09-09", cat: "rentree", label: "1ère journée (7e)!" },
  { date: "2026-09-10", cat: "rentree", label: "1ère journée (8e)!" },
  { date: "2026-09-11", cat: "rentree", label: "École pour tous!" },
  { date: "2026-09-18", cat: "pedagogique", label: "½ formation + ½ CAP" },
  { date: "2026-09-30", cat: "conge", label: "Vérité et réconciliation" },

  // October 2026
  { date: "2026-10-09", cat: "pedagogique", label: "Journée CAP" },
  { date: "2026-10-12", cat: "conge", label: "Action de grâce" },
  { date: "2026-10-23", cat: "pedagogique", label: "Journée de PAQ" },

  // November 2026
  { date: "2026-11-11", cat: "conge", label: "Jour du Souvenir" },
  { date: "2026-11-20", cat: "pedagogique", label: "½ admin. + ½ CAP" },

  // December 2026
  { date: "2026-12-04", cat: "pedagogique", label: "½ CAP + ½ rencontre parents" },
  { date: "2026-12-18", cat: "special", label: "Dernier jour avant les fêtes" },

  // January 2027
  { date: "2027-01-04", cat: "special", label: "Réouverture des classes" },
  { date: "2027-01-29", cat: "pedagogique", label: "½ CAP + ½ formation" },

  // February 2027
  { date: "2027-02-12", cat: "pedagogique", label: "Journée CAP" },
  { date: "2027-02-15", cat: "conge", label: "Jour de la Famille" },

  // March 2027
  { date: "2027-03-01", end: "2027-03-05", cat: "conge", label: "Congé de mars" },
  { date: "2027-03-19", cat: "pedagogique", label: "½ admin. + ½ CAP" },
  { date: "2027-03-26", cat: "conge", label: "Vendredi saint" },
  { date: "2027-03-29", cat: "conge", label: "Lundi de Pâques" },

  // April 2027
  { date: "2027-04-02", cat: "pedagogique", label: "½ CAP + ½ rencontre parents" },
  { date: "2027-04-16", cat: "pedagogique", label: "½ CAP + ½ perfectionnement AEFNB" },

  // May 2027
  { date: "2027-05-07", cat: "pedagogique", label: "½ CAP + ½ perfectionnement AEFNB" },
  { date: "2027-05-21", cat: "personnel", label: "Journée AGA AEFNB" },
  { date: "2027-05-24", cat: "conge", label: "Fête de la Reine" },

  // June 2027
  { date: "2027-06-18", cat: "personnel", label: "Journée administrative" },
  { date: "2027-06-25", cat: "special", label: "Dernier jour des classes" },
  { date: "2027-06-28", cat: "personnel", label: "Journée administrative" },
  { date: "2027-06-29", cat: "personnel", label: "Perfectionnement AEFNB" },
  { date: "2027-06-30", cat: "personnel", label: "Journée administrative" },
];

// Category → CSS variable mapping
const CAT_COLOR_VAR = {
  conge: "--a5",
  pedagogique: "--a4",
  personnel: "--a3",
  rentree: "--a1",
  special: "--a2",
};

// Category → Hex color (for DOCX export)
const CAT_HEX_DEFAULT = {
  conge: "F6D3D9",
  pedagogique: "FAEAB8",
  personnel: "CBE8DE",
  rentree: "E3D9F5",
  special: "FBDCCB",
};

// Build map: ISO date string → array of events
const EVENTS_BY_DATE = {};

function addDayEvent(iso, ev) {
  if (!EVENTS_BY_DATE[iso]) {
    EVENTS_BY_DATE[iso] = [];
  }
  EVENTS_BY_DATE[iso].push(ev);
}

// Expand date ranges into individual day entries
CALENDAR_EVENTS.forEach((ev) => {
  if (ev.end) {
    let d = new Date(ev.date + "T00:00:00");
    const endD = new Date(ev.end + "T00:00:00");
    while (d <= endD) {
      addDayEvent(d.toISOString().slice(0, 10), ev);
      d.setDate(d.getDate() + 1);
    }
  } else {
    addDayEvent(ev.date, ev);
  }
});

// =================================================================
// SCHEDULE ROWS: Cours vs. Dividers (Récréation, Dîner)
// =================================================================
const SCHEDULE_ROWS = [
  { type: "cours", heure: "8h15-8h55", lbl: "Cours 1" },
  { type: "cours", heure: "9h-9h50", lbl: "Cours 2" },
  { type: "divider", heure: "9h50-10h10", lbl: "Récréation" },
  { type: "cours", heure: "10h15-11h05", lbl: "Cours 3" },
  { type: "cours", heure: "11h10-12h", lbl: "Cours 4" },
  {
    type: "divider",
    heure: "12h-13h06",
    lbl: "Dîner 1 · 12h-12h22   Dîner 2 · 12h22-12h44   Dîner 3 · 12h44-13h06",
  },
  { type: "cours", heure: "13h10-14h", lbl: "Cours 5" },
  { type: "cours", heure: "14h05-14h55", lbl: "Cours 6" },
  { type: "cours", heure: "14h55-15h", lbl: "Organisation" },
];

// =================================================================
// LOCALE CONSTANTS
// =================================================================
const MOIS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const JOURS_COURTS = ["D", "L", "M", "M", "J", "V", "S"];
const JOURS_SURV = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

// =================================================================
// DATE UTILITIES
// =================================================================

/**
 * Convert Date to ISO string (YYYY-MM-DD)
 */
function isoOf(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Format Date in French (e.g., "7 septembre")
 */
function dateFr(d) {
  return d.toLocaleDateString("fr-CA", { day: "numeric", month: "long" });
}

/**
 * Get events for a specific ISO date
 */
function dayEvents(iso) {
  return EVENTS_BY_DATE[iso] || [];
}

// =================================================================
// MONTH MATRIX (for mini calendar)
// =================================================================

/**
 * Generate a week-grid matrix for a given month.
 * Each week is an array of dates (or null for empty cells).
 */
function monthMatrix(year, monthIdx) {
  const first = new Date(year, monthIdx, 1);
  const startOffset = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const cells = [];

  // Add leading empty cells
  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  // Add day numbers
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  // Pad to full weeks
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  // Convert to weeks
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}

// =================================================================
// MINI CALENDAR RENDERING
// =================================================================

/**
 * Render a mini calendar for a given week start date.
 * Highlights Mon-Fri of that week.
 */
function renderMiniCal(weekStartDate) {
  const y = weekStartDate.getFullYear();
  const m = weekStartDate.getMonth();
  const weeks = monthMatrix(y, m);

  // Get day numbers for Mon-Fri of this week
  const weekDates = [0, 1, 2, 3, 4].map((i) => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    return d.getDate();
  });

  let html = `<div class="minical"><div class="mtitle">${MOIS_FR[m]}</div><table><thead><tr>`;

  JOURS_COURTS.forEach((j) => (html += `<th>${j}</th>`));
  html += `</tr></thead><tbody>`;

  weeks.forEach((w) => {
    html += "<tr>";
    w.forEach((d, idx) => {
      if (d === null) {
        html += `<td class="empty">·</td>`;
        return;
      }
      const isHl = weekDates.includes(d) && idx >= 1 && idx <= 5;
      html += `<td class="${isHl ? "hl" : ""}">${d}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table></div>";
  return html;
}

// =================================================================
// HORAIRE TABLE RENDERING
// =================================================================

/**
 * Render a single horaire table for a set of days.
 * Supports 2 or 3 days, with shared hour column.
 */
function renderHoraireTable(dayDates, dayNames, weekIdx, dayIdxOffset, showHeureCol) {
  let html = `<table class="horaire"><colgroup>`;

  if (showHeureCol) html += `<col class="heure-col">`;
  dayDates.forEach(() => (html += `<col>`));

  html += `</colgroup><thead>
    <tr>${showHeureCol ? '<th class="th-heure-corner"></th>' : ""}${dayNames
    .map((n) => `<th class="th-head">${n}</th>`)
    .join("")}</tr>
    <tr class="tr-date">${showHeureCol ? "<td></td>" : ""}${dayDates
    .map((d) => `<td>${dateFr(d)}</td>`)
    .join("")}</tr>
    <tr class="tr-event">${showHeureCol ? "<td></td>" : ""}${dayDates
    .map((d) => {
      const evs = dayEvents(isoOf(d));
      if (!evs.length) return `<td></td>`;
      return `<td>${evs
        .map(
          (ev) =>
            `<div class="event-pill" style="background:var(${CAT_COLOR_VAR[ev.cat]})">${ev.label}</div>`
        )
        .join("")}</td>`;
    })
    .join("")}</tr>
  </thead><tbody>`;

  // Add course rows and dividers
  SCHEDULE_ROWS.forEach((row) => {
    const nCols = dayDates.length + (showHeureCol ? 1 : 0);

    if (row.type === "divider") {
      html += `<tr class="divider-row"><td colspan="${nCols}">${row.lbl} · ${row.heure}</td></tr>`;
    } else {
      html += `<tr>${showHeureCol ? `<td class="heure-cell">${row.lbl}<br>${row.heure}</td>` : ""}`;

      dayDates.forEach((d, i) => {
        const di = dayIdxOffset + i;
        const sanitizedLabel = row.lbl.replace(/\s/g, "");
        html += `<td class="case-cell"><textarea id="t-case-${weekIdx}-${di}-${sanitizedLabel}"></textarea></td>`;
      });

      html += `</tr>`;
    }
  });

  // Add notes row if configured
  if (settings.notes === "sous" || settings.notes === "deux") {
    const nCols = dayDates.length + (showHeureCol ? 1 : 0);
    html += `<tr class="notes-row">${showHeureCol ? '<td class="heure-cell">Notes</td>' : ""}`;

    dayDates.forEach((d, i) => {
      const di = dayIdxOffset + i;
      html += `<td><textarea id="t-notes-${weekIdx}-${di}"></textarea></td>`;
    });

    html += `</tr>`;
  }

  html += `</tbody></table>`;
  return html;
}

// =================================================================
// SIDE COLUMN RENDERING
// =================================================================

/**
 * Render surveillance table
 */
function renderSurveillanceBlock(weekIdx) {
  let html = `<div class="side-block"><h4>Surveillances</h4><table class="surv-table"><thead><tr><th>Jour</th><th>Heure</th><th>Zone</th></tr></thead><tbody>`;

  JOURS_SURV.forEach((j, i) => {
    html += `<tr><td>${j}</td>
      <td><input type="text" class="surv-input" id="s-heure-${weekIdx}-${i}"></td>
      <td><input type="text" class="surv-input" id="s-zone-${weekIdx}-${i}"></td></tr>`;
  });

  html += `</tbody></table></div>`;
  return html;
}

/**
 * Render the right-side column with mini calendar, notes, clinics, surveillance
 */
function renderSideColumn(weekStart, weekIdx) {
  let html = `<div class="side-col">`;

  if (settings.minical === "oui") {
    html += renderMiniCal(weekStart);
  }

  if (settings.notes === "cote" || settings.notes === "deux") {
    html += `<div class="side-block"><h4>Notes</h4><textarea id="t-side-notes-${weekIdx}" rows="3"></textarea></div>`;
  }

  html += `<div class="side-block"><h4>Cliniques / évaluations</h4><textarea id="t-cliniques-${weekIdx}" rows="2"></textarea></div>`;
  html += renderSurveillanceBlock(weekIdx);

  html += `</div>`;
  return html;
}

// =================================================================
// WEEK RENDERING
// =================================================================

/**
 * Generate a human-readable week label
 */
function weekNumberLabel(weekStart, idx) {
  return `Semaine ${idx + 1} — ${dateFr(weekStart)}`;
}

/**
 * Render both pages (Mon-Wed, Thu-Fri) for a week
 */
function renderWeek(weekStart, idx) {
  // Get 5 weekday dates (Mon-Fri)
  const days = [0, 1, 2, 3, 4].map((i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const page1 = `<div class="page">
      <div class="week-title">${weekNumberLabel(weekStart, idx)} — Lundi à Mercredi</div>
      <div class="page-body">
        ${renderHoraireTable(
          [days[0], days[1], days[2]],
          ["Lundi", "Mardi", "Mercredi"],
          idx,
          0,
          true
        )}
      </div>
    </div>`;

  const page2 = `<div class="page">
      <div class="week-title">${weekNumberLabel(weekStart, idx)} — Jeudi et Vendredi</div>
      <div class="page-body">
        ${renderHoraireTable(
          [days[3], days[4]],
          ["Jeudi", "Vendredi"],
          idx,
          3,
          true
        )}
        ${renderSideColumn(weekStart, idx)}
      </div>
    </div>`;

  return page1 + page2;
}

// =================================================================
// SCHOOL WEEKS CALCULATION
// =================================================================

/**
 * Generate 42 weeks from Sept 7, 2026 to June 25, 2027
 * First week starts on Monday, Sept 7
 */
function schoolWeeks() {
  const weeks = [];
  let cur = new Date(2026, 8, 7); // September 7, 2026 (Monday)
  const last = new Date(2027, 5, 25); // June 25, 2027

  while (cur <= last) {
    weeks.push(new Date(cur));
    cur.setDate(cur.getDate() + 7);
  }

  return weeks;
}
