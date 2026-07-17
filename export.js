/* ============================================================================
   MON AGENDA PÉDAGO — EXPORT FUNCTIONALITY
   PDF printing, PNG/Canva export, Word (.docx) export
   ============================================================================ */

// =================================================================
// PNG EXPORT (Canva/GoodNotes compatible)
// Uses html2canvas to convert each page to image
// =================================================================

document.getElementById("png-btn").addEventListener("click", async () => {
  const pages = document.querySelectorAll("#full-year-target .page");

  if (!pages.length) {
    alert("Générez d'abord les 42 semaines.");
    return;
  }

  const btn = document.getElementById("png-btn");
  btn.textContent = "Export en cours...";
  btn.disabled = true;

  try {
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `mon-agenda-pedago-page-${String(i + 1).padStart(2, "0")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Small delay between downloads to avoid browser throttling
      await new Promise((r) => setTimeout(r, 350));
    }

    alert(`${pages.length} pages exportées en PNG.`);
  } catch (err) {
    alert("Erreur pendant l'export PNG : " + err.message);
  } finally {
    btn.textContent = "🖼️ Exporter en PNG (Canva)";
    btn.disabled = false;
  }
});

// =================================================================
// WORD (.DOCX) EXPORT
// Uses docx library to create native Word document
// =================================================================

document.getElementById("docx-btn").addEventListener("click", async () => {
  const pages = document.querySelectorAll("#full-year-target .page");

  if (!pages.length) {
    alert("Générez d'abord les 42 semaines.");
    return;
  }

  const btn = document.getElementById("docx-btn");
  btn.textContent = "Génération du Word en cours...";
  btn.disabled = true;

  try {
    const blob = await buildDocx();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Mon-Agenda-Pedago-2026-2027.docx";
    link.click();
  } catch (err) {
    alert("Erreur pendant la génération du Word : " + err.message);
  } finally {
    btn.textContent = "📄 Exporter en Word (.docx natif)";
    btn.disabled = false;
  }
});

/**
 * Build a complete DOCX document with all weeks
 */
async function buildDocx() {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    PageBreak,
    AlignmentType,
    ShadingType,
    VerticalAlign,
  } = docx;

  const hex = currentPaletteHex();

  /**
   * Helper: create a paragraph with text
   */
  function cellPara(text, opts = {}) {
    return new Paragraph({
      children: [
        new TextRun({
          text,
          bold: opts.bold || false,
          italics: opts.italics || false,
          size: opts.size || 16,
          color: opts.color,
        }),
      ],
    });
  }

  /**
   * Helper: create a horaire table for Word
   */
  function horaireTable(dayDates, dayNames) {
    const nCols = dayDates.length + 1;
    const rows = [];

    // Header row with day names
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [cellPara("")] }),
          ...dayNames.map(
            (n) =>
              new TableCell({
                children: [cellPara(n, { bold: true, size: 20 })],
                shading: {
                  type: ShadingType.SOLID,
                  color: "1c1c1c",
                  fill: "1c1c1c",
                },
              })
          ),
        ],
      })
    );

    // Date row
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [cellPara("")] }),
          ...dayDates.map((d) =>
            new TableCell({
              children: [cellPara(dateFr(d), { italics: true, size: 14, color: "555555" })],
            })
          ),
        ],
      })
    );

    // Events row
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [cellPara("")] }),
          ...dayDates.map((d) => {
            const evs = dayEvents(isoOf(d));
            const children =
              evs.length > 0
                ? evs.map((ev) => cellPara(ev.label, { bold: true, size: 14 }))
                : [cellPara("")];

            return new TableCell({
              children,
              shading: evs.length
                ? {
                    type: ShadingType.SOLID,
                    color: hex[evs[0].cat],
                    fill: hex[evs[0].cat],
                  }
                : undefined,
            });
          }),
        ],
      })
    );

    // Schedule rows
    SCHEDULE_ROWS.forEach((row) => {
      if (row.type === "divider") {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: nCols,
                shading: {
                  type: ShadingType.SOLID,
                  color: "F4F2EE",
                  fill: "F4F2EE",
                },
                children: [cellPara(`${row.lbl} · ${row.heure}`, { bold: true, size: 14 })],
              }),
            ],
          })
        );
      } else {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  cellPara(row.lbl, { bold: true, size: 13 }),
                  cellPara(row.heure, { size: 11, color: "666666" }),
                ],
              }),
              ...dayDates.map(
                () =>
                  new TableCell({
                    children: [cellPara("")],
                    verticalAlign: VerticalAlign.TOP,
                  })
              ),
            ],
          })
        );
      }
    });

    // Notes row
    if (settings.notes === "sous" || settings.notes === "deux") {
      rows.push(
        new TableRow({
          children: [
            new TableCell({ children: [cellPara("Notes", { bold: true, size: 13 })] }),
            ...dayDates.map(() => new TableCell({ children: [cellPara("")] })),
          ],
        })
      );
    }

    return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
  }

  /**
   * Helper: create mini calendar for Word
   */
  function miniCalTable(weekStart) {
    const y = weekStart.getFullYear();
    const m = weekStart.getMonth();
    const weeks = monthMatrix(y, m);

    const weekDates = [0, 1, 2, 3, 4].map((i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d.getDate();
    });

    const rows = [
      new TableRow({
        children: JOURS_COURTS.map(
          (j) =>
            new TableCell({
              children: [cellPara(j, { bold: true, size: 14 })],
              shading: {
                type: ShadingType.SOLID,
                color: "1c1c1c",
                fill: "1c1c1c",
              },
            })
        ),
      }),
    ];

    weeks.forEach((w) => {
      rows.push(
        new TableRow({
          children: w.map((d, idx) => {
            const isHl = d !== null && weekDates.includes(d) && idx >= 1 && idx <= 5;
            return new TableCell({
              children: [cellPara(d === null ? "" : String(d), { size: 14 })],
              shading: isHl
                ? {
                    type: ShadingType.SOLID,
                    color: hex.rentree,
                    fill: hex.rentree,
                  }
                : undefined,
            });
          }),
        })
      );
    });

    return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
  }

  /**
   * Helper: create surveillance table
   */
  function survTable() {
    const survRows = [
      new TableRow({
        children: ["Jour", "Heure", "Zone"].map(
          (h) =>
            new TableCell({
              children: [cellPara(h, { bold: true, size: 14 })],
            })
        ),
      }),
    ];

    JOURS_SURV.forEach((j) => {
      survRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [cellPara(j, { bold: true, size: 14 })],
            }),
            new TableCell({
              children: [cellPara("", { size: 14 })],
            }),
            new TableCell({
              children: [cellPara("", { size: 14 })],
            }),
          ],
        })
      );
    });

    return new Table({ rows: survRows, width: { size: 100, type: WidthType.PERCENTAGE } });
  }

  // Build document
  const allChildren = [
    new Paragraph({
      children: [new TextRun({ text: "Mon Agenda Pédago", bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Année scolaire 2026-2027 · District scolaire francophone Sud",
          size: 20,
          color: "555555",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];

  const weeks = schoolWeeks();
  weeks.forEach((weekStart, idx) => {
    const days = [0, 1, 2, 3, 4].map((i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });

    // Page 1: Mon-Wed
    allChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${weekNumberLabel(weekStart, idx)} — Lundi à Mercredi`,
            bold: true,
            size: 26,
          }),
        ],
      })
    );
    allChildren.push(
      horaireTable([days[0], days[1], days[2]], ["Lundi", "Mardi", "Mercredi"])
    );
    allChildren.push(new Paragraph({ children: [new PageBreak()] }));

    // Page 2: Thu-Fri
    allChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${weekNumberLabel(weekStart, idx)} — Jeudi et Vendredi`,
            bold: true,
            size: 26,
          }),
        ],
      })
    );
    allChildren.push(horaireTable([days[3], days[4]], ["Jeudi", "Vendredi"]));

    // Mini calendar if enabled
    if (settings.minical === "oui") {
      allChildren.push(
        new Paragraph({
          children: [new TextRun({ text: MOIS_FR[weekStart.getMonth()], bold: true, size: 22 })],
        })
      );
      allChildren.push(miniCalTable(weekStart));
    }

    // Notes section
    if (settings.notes === "cote" || settings.notes === "deux") {
      allChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "Notes", bold: true, size: 20 })],
        })
      );
    }

    // Clinics section
    allChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "Cliniques / évaluations", bold: true, size: 20 })],
      })
    );

    // Surveillance section
    allChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "Surveillances", bold: true, size: 20 })],
      })
    );
    allChildren.push(survTable());

    allChildren.push(new Paragraph({ children: [new PageBreak()] }));
  });

  const doc = new Document({ sections: [{ children: allChildren }] });
  return await Packer.toBlob(doc);
}
