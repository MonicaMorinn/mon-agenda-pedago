/* ============================================================================
   MON AGENDA PÉDAGO — CALENDAR DATA & RENDERING LOGIC
   42 weeks school calendar 2026-2027, DSFS events
   ============================================================================ */

// =================================================================
// CATEGORY → CSS VARIABLE MAPPING
// =================================================================
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

// =================================================================
// SCHEDULE ROWS: Cours vs. Dividers (Récréation, Dîner)
// =================================================================
const SCHEDULE_ROWS = [
  { type: "cours", heure: "8h15-8h55", lbl: "Cours 1" },
  { type: "cours", heure: "9h-9h50", lbl: "Cours 2" },
  { type: "divider", heure: "9h50-10h10", lbl: "Récréation" },
  { type: "cours", heure: "10h15-11h05", lbl: "Cours 3" },
  { type: "cours", heure: "11h10-12h", lbl: "Cours 4" },
  { type: "divider", heure: "12h-13h06", lbl: "Dîner" },
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
 * Get month name in French
 */
function monthFr(d) {
  return MOIS_FR[d.getMonth()];
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
// HORAIRE TABLE RENDERING — LUNDI À MERCREDI (avec heures)
// =================================================================

/**
 * Render horaire table for Mon-Wed (3 days with hour column)
 */
function renderHoraireTableMWF(dayDates, dayNames, weekIdx, dayIdxOffset) {
  let html = `<table class="horaire"><colgroup>
    <col class="heure-col">`;
  dayDates.forEach(() => (html += `<col>`));

  html += `</colgroup><thead>
    <tr>
      <th class="th-heure-corner"></th>
      ${dayNames.map((n) => `<th class="th-head">${n}</th>`).join("")}
    </tr>
    <tr class="tr-date">
      <td></td>
      ${dayDates.map((d) => `<td>${dateFr(d)}</td>`).join("")}
    </tr>
    <tr class="tr-event">
      <td></td>
      ${dayDates
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
        .join("")}
    </tr>
  </thead><tbody>`;

  // Add course rows and dividers
  SCHEDULE_ROWS.forEach((row) => {
    if (row.type === "divider") {
      html += `<tr class="divider-row"><td colspan="4">${row.lbl}</td></tr>`;
    } else {
      html += `<tr>
        <td class="heure-cell">${row.lbl}<br>${row.heure}</td>`;

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
    html += `<tr class="notes-row">
      <td class="heure-cell">Notes</td>`;

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
// HORAIRE TABLE RENDERING — JEUDI À VENDREDI (sans heures)
// =================================================================

/**
 * Render horaire table for Thu-Fri (2 days WITHOUT hour column)
 * Larger writing cells, same structure as Mon-Wed but simplified
 */
function renderHoraireTableThF(dayDates, dayNames, weekIdx, dayIdxOffset) {
  let html = `<table class="horaire horaire-simple"><colgroup>`;
  dayDates.forEach(() => (html += `<col>`));

  html += `</colgroup><thead>
    <tr>
      ${dayNames.map((n) => `<th class="th-head">${n}</th>`).join("")}
    </tr>
    <tr class="tr-date">
      ${dayDates.map((d) => `<td>${dateFr(d)}</td>`).join("")}
    </tr>
    <tr class="tr-event">
      ${dayDates
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
        .join("")}
    </tr>
  </thead><tbody>`;

  // Add course rows and dividers (same as Mon-Wed but without hour column)
  SCHEDULE_ROWS.forEach((row) => {
    if (row.type === "divider") {
      html += `<tr class="divider-row"><td colspan="2">${row.lbl}</td></tr>`;
    } else {
      html += `<tr>`;

      dayDates.forEach((d, i) => {
        const di = dayIdxOffset + i;
        const sanitizedLabel = row.lbl.replace(/\s/g, "");
        html += `<td class="case-cell case-cell-large"><textarea id="t-case-${weekIdx}-${di}-${sanitizedLabel}"></textarea></td>`;
      });

      html += `</tr>`;
    }
  });

  // Add notes row if configured
  if (settings.notes === "sous" || settings.notes === "deux") {
    html += `<tr class="notes-row">`;

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
// SURVEILLANCE TABLE RENDERING
// =================================================================

/**
 * Render surveillance table (compact, bottom of page)
 */
function renderSurveillanceBlock(weekIdx) {
  let html = `<div class="side-block surv-block"><h4>Surveillances</h4><table class="surv-table"><thead><tr><th>Jour</th><th>Heure</th><th>Zone</th></tr></thead><tbody>`;

  JOURS_SURV.forEach((j, i) => {
    html += `<tr><td>${j}</td>
      <td><input type="text" class="surv-input" id="s-heure-${weekIdx}-${i}"></td>
      <td><input type="text" class="surv-input" id="s-zone-${weekIdx}-${i}"></td></tr>`;
  });

  html += `</tbody></table></div>`;
  return html;
}

// =================================================================
// SIDE COLUMN RENDERING (JEUDI-VENDREDI RIGHT SIDE)
// =================================================================

/**
 * Render the right-side column with mini calendar, notes, clinics, surveillance
 */
function renderSideColumn(weekStart, weekIdx) {
  let html = `<div class="side-col">`;

  if (settings.notes === "cote" || settings.notes === "deux") {
    html += `<div class="side-block"><h4>Notes</h4><textarea id="t-side-notes-${weekIdx}" rows="3"></textarea></div>`;
  }

  html += `<div class="side-block"><h4>Cliniques / évaluations</h4><textarea id="t-cliniques-${weekIdx}" rows="2"></textarea></div>`;

  // Mini calendar at bottom if enabled
  if (settings.minical === "oui") {
    html += `<div class="side-block minical-block">
      ${renderMiniCal(weekStart)}
    </div>`;
  }

  html += `</div>`;
  return html;
}

// =================================================================
// WEEK RENDERING (2 PAGES)
// =================================================================

/**
 * Render both pages (Mon-Wed, Thu-Fri) for a week
 * NO week titles - pages start directly with tables
 */
function renderWeek(weekStart, idx) {
  // Get 5 weekday dates (Mon-Fri)
  const days = [0, 1, 2, 3, 4].map((i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // PAGE 1: LUNDI À MERCREDI (with hour column)
  const page1 = `<div class="page">
    <div class="page-body">
      ${renderHoraireTableMWF(
        [days[0], days[1], days[2]],
        ["Lundi", "Mardi", "Mercredi"],
        idx,
        0
      )}
    </div>
  </div>`;

  // PAGE 2: JEUDI ET VENDREDI (no hour column) + side column
  const page2 = `<div class="page">
    <div class="month-label">${monthFr(days[3])}</div>
    <div class="page-body page-body-thf">
      <div class="page-body-main">
        ${renderHoraireTableThF(
          [days[3], days[4]],
          ["Jeudi", "Vendredi"],
          idx,
          3
        )}
        ${renderSurveillanceBlock(idx)}
      </div>
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
