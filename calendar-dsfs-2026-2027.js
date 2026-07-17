/* ============================================================================
   CALENDRIER SCOLAIRE DSFS 2026-2027
   District scolaire francophone Sud — Communauté de Moncton
   
   SOURCE: Calendrier officiel DSFS 2026-2027
   Écoles: Champlain, Claudette-Bradshaw, L'Odyssée, Le Mascaret, 
           Le Sommet, Sainte-Bernadette, Saint-Henri
   
   EXCEPTION: Rentrée progressive personnalisée à l'école
   ============================================================================ */

// =================================================================
// ÉVÉNEMENTS OFFICIELS DSFS 2026-2027
// =================================================================

const DSFS_EVENTS = [
  // ===== AOÛT 2026 =====
  { date: "2026-08-31", cat: "personnel", label: "Journée administrative", level: "all" },

  // ===== SEPTEMBRE 2026 =====
  { date: "2026-09-01", cat: "personnel", label: "Perfectionnement AEFNB", level: "all" },
  { date: "2026-09-02", cat: "pedagogique", label: "Journée de PAQ", level: "all" },
  { date: "2026-09-03", end: "2026-09-04", cat: "personnel", label: "Journée administrative", level: "all" },
  { date: "2026-09-07", cat: "conge", label: "Fête du Travail", level: "all" },
  
  // EXCEPTION: Rentrée progressive (personnalisé à l'école)
  { date: "2026-09-08", cat: "rentree", label: "1ère journée 6e année", level: "6" },
  { date: "2026-09-09", cat: "rentree", label: "1ère journée 7e année", level: "7" },
  { date: "2026-09-10", cat: "rentree", label: "1ère journée 8e année", level: "8" },
  { date: "2026-09-11", cat: "rentree", label: "École pour tous!", level: "all" },
  
  { date: "2026-09-18", cat: "pedagogique", label: "½ formation + ½ CAP (primaire) / Journée CAP (secondaire)", level: "all" },
  { date: "2026-09-30", cat: "conge", label: "Journée vérité et réconciliation", level: "all" },

  // ===== OCTOBRE 2026 =====
  { date: "2026-10-09", cat: "pedagogique", label: "Journée CAP", level: "all" },
  { date: "2026-10-12", cat: "conge", label: "Action de grâce", level: "all" },
  { date: "2026-10-23", cat: "pedagogique", label: "Journée de PAQ", level: "all" },

  // ===== NOVEMBRE 2026 =====
  { date: "2026-11-11", cat: "conge", label: "Jour du souvenir", level: "all" },
  { date: "2026-11-20", cat: "pedagogique", label: "½ admin + ½ CAP (primaire) / Formation + rencontre parents (secondaire)", level: "all" },

  // ===== DÉCEMBRE 2026 =====
  { date: "2026-12-04", cat: "pedagogique", label: "½ CAP + ½ rencontre parents (primaire) / Journée CAP (secondaire)", level: "all" },
  { date: "2026-12-18", cat: "special", label: "Dernier jour avant les fêtes", level: "all" },

  // ===== JANVIER 2027 =====
  { date: "2027-01-04", cat: "special", label: "Réouverture des classes", level: "all" },
  { date: "2027-01-29", cat: "pedagogique", label: "½ CAP + ½ formation (primaire) / Intersemestre (secondaire)", level: "all" },

  // ===== FÉVRIER 2027 =====
  { date: "2027-02-01", cat: "pedagogique", label: "1er jour 2e semestre (secondaire)", level: "all" },
  { date: "2027-02-02", cat: "pedagogique", label: "Intersemestre (secondaire)", level: "all" },
  { date: "2027-02-12", cat: "pedagogique", label: "Journée CAP", level: "all" },
  { date: "2027-02-15", cat: "conge", label: "Jour de la Famille", level: "all" },

  // ===== MARS 2027 =====
  { date: "2027-03-01", end: "2027-03-05", cat: "conge", label: "Congé de mars", level: "all" },
  { date: "2027-03-19", cat: "pedagogique", label: "½ admin + ½ CAP (primaire) / Journée CAP (secondaire)", level: "all" },
  { date: "2027-03-26", cat: "conge", label: "Vendredi saint", level: "all" },
  { date: "2027-03-29", cat: "conge", label: "Lundi de Pâques", level: "all" },

  // ===== AVRIL 2027 =====
  { date: "2027-04-02", cat: "pedagogique", label: "½ CAP + ½ rencontre parents (primaire) / Journée CAP (secondaire)", level: "all" },
  { date: "2027-04-16", cat: "pedagogique", label: "½ CAP + ½ perfectionnement AEFNB (primaire) / Formation + rencontre parents (secondaire)", level: "all" },

  // ===== MAI 2027 =====
  { date: "2027-05-07", cat: "pedagogique", label: "½ CAP + ½ perfectionnement AEFNB", level: "all" },
  { date: "2027-05-21", cat: "personnel", label: "Journée AGA AEFNB", level: "all" },
  { date: "2027-05-24", cat: "conge", label: "Fête de la Reine", level: "all" },

  // ===== JUIN 2027 =====
  { date: "2027-06-18", cat: "personnel", label: "Journée administrative", level: "all" },
  { date: "2027-06-25", cat: "special", label: "Dernier jour des classes", level: "all" },
  { date: "2027-06-28", cat: "personnel", label: "Journée administrative", level: "all" },
  { date: "2027-06-29", cat: "personnel", label: "Perfectionnement AEFNB", level: "all" },
  { date: "2027-06-30", cat: "personnel", label: "Journée administrative", level: "all" },
];

// =================================================================
// BUILD EVENTS MAP
// =================================================================

const EVENTS_BY_DATE = {};

function addDayEvent(iso, ev) {
  if (!EVENTS_BY_DATE[iso]) {
    EVENTS_BY_DATE[iso] = [];
  }
  EVENTS_BY_DATE[iso].push(ev);
}

// Expand date ranges into individual day entries
DSFS_EVENTS.forEach((ev) => {
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
// GET EVENTS FOR A SPECIFIC DATE
// =================================================================

function dayEvents(iso) {
  return EVENTS_BY_DATE[iso] || [];
}
