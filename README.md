# 📚 Mon Agenda Pédago — Planner 2026-2027

Un planner scolaire professionnel et imprimable pour enseignants, conçu pour le District scolaire francophone Sud (DSFS) de Moncton.

**Style** : Pinterest/Etsy aesthetic · Pastel doux · Polices Caveat + Quicksand  
**Format** : Letter Canada (8.5" × 11") · 42 semaines scolaires · Sans serveur (GitHub Pages)

---

## 🎯 Caractéristiques

✅ **Calendrier** : 42 semaines d'école (sept 7, 2026 → juin 25, 2027)  
✅ **Événements DSFS** : Tous les jours fériés, formations, congés intégrés  
✅ **Horaire réaliste** : 6 cours + récréation + dîner (3 tranches)  
✅ **Personnalisation** : Niveau scolaire (6e, 7e, 8e), placement notes, couleurs  
✅ **Export** : PDF (impression), PNG (Canva/GoodNotes), Word (.docx natif)  
✅ **Sauvegarde** : JSON local, reprendre vos modifications + localStorage

---

## 📂 Structure des fichiers

```
mon-agenda-pedago/
├── index.html       # Structure HTML principale
├── style.css        # Styles complets (print + responsive)
├── calendar.js      # Calendrier, événements DSFS, fonctions de rendu
├── script.js        # Logique UI, settings, save/load
├── export.js        # Export PNG, PDF, Word (.docx)
└── README.md        # Cette documentation
```

### Rôle de chaque fichier

**`index.html`**
- Structure sémantique HTML5
- En-tête de branding
- Cartes de réglages (niveau, notes, palette)
- Conteneur aperçu et plein écran
- Import des 3 scripts JS + feuille CSS
- **À ne pas modifier** : structure de base stable

**`style.css`**
- Design complet : branding, formulaires, tableaux horaires
- Palette pastel (5 couleurs : lavande, pêche, menthe, beurre, rose)
- Media queries print : format Letter Canada exact
- Responsive (mobile friendly)
- **À modifier si** : vous voulez changer les couleurs, polices, espacements

**`calendar.js`**
- Données DSFS : 30+ événements 2026-2027
- Calcul des 42 semaines (lun 7 sept → ven 25 juin)
- Horaire (9 lignes : 6 cours + 3 dividers)
- Utilitaires : formatage dates, mini calendrier, matrices mois
- **À modifier si** : vous changez les dates, événements, ou horaire

**`script.js`**
- Gestion du state (`settings` global)
- Wiring des pills (niveau, notes, palette, couleurs)
- Réaffichage dynamique (`rerender()`, `generateFullYear()`)
- Save/Load JSON : `collectFieldValues()`, `applyFieldValues()`
- **À modifier si** : vous ajoutez de nouveaux réglages ou fonctionnalités

**`export.js`**
- PNG : `html2canvas` → télécharge chaque page
- Word : `docx` library → tableau natif, couleurs, structure
- PDF : natif via `window.print()` (CSS @page)
- **À modifier si** : vous changez le format d'export ou la structure

---

## 🚀 Utilisation

### 1️⃣ Démarrage
1. Accédez à `https://monicamorinn.github.io/mon-agenda-pedago/`
2. Vous voyez l'**aperçu** : semaine du 7 septembre 2026

### 2️⃣ Réglages (avant génération)

**Niveau principal** : 6e, 7e, ou 8e
- Les événements des 3 niveaux s'affichent toujours
- Change uniquement le contexte visuel

**Emplacement des notes**
- **Sous** : Case de notes sous chaque journée (par défaut)
- **Côté** : Mini colonne à droite (mini calendrier + notes + cliniques)
- **Les deux** : Notes partout

**Mini calendrier mensuel**
- **Afficher** : Mini calendrier avec semaine surlignée en lavande (défaut)
- **Ne pas afficher** : Gain de place

**Palette**
- **Pastel** : 5 couleurs douces (défaut)
- **Personnalisée** : Choisissez vos 5 couleurs
- **N&B** : Noir et blanc (impression économe)

### 3️⃣ Générer

Cliquez **"Générer les 42 semaines"**
- Calcule 84 pages (2 par semaine : lun-mer, jeu-ven)
- Ajoute mini calendrier, cliniques, surveillances
- Active les boutons d'export

### 4️⃣ Modifier & Imprimer

- Écrivez dans chaque case de cours, notes, surveillances
- Les changements restent en mémoire (session)
- **🖨️ Imprimer / PDF** : Ctrl+P ou Print button
- La mise en page respecte Letter Canada (8.5" × 11")

### 5️⃣ Exporter

**💾 Enregistrer mon planner (.json)**
- Télécharge votre travail en JSON
- Contient settings + tous les champs remplis
- Reprendre plus tard : bouton "📂 Reprendre un enregistrement"

**🖼️ Exporter en PNG (Canva)**
- Une image par page (84 PNG)
- Importe dans Canva, GoodNotes, Procreate
- Haute résolution (2x)

**📄 Exporter en Word (.docx natif)**
- Document complet avec tables, couleurs, mise en page
- Modifiable dans Word, Google Docs, etc.
- Couleurs respectent votre palette

---

## 🔧 Personnalisation avancée

### Changer les dates DSFS

Ouvrez `calendar.js`, cherchez `CALENDAR_EVENTS` :

```javascript
const CALENDAR_EVENTS = [
  { date: "2026-08-31", cat: "personnel", label: "Journée administrative" },
  // Ajouter ou modifier ici
];
```

**Catégories** (couleurs) :
- `conge` → Rose (--a5)
- `pedagogique` → Beurre (--a4)
- `personnel` → Menthe (--a3)
- `rentree` → Lavande (--a1)
- `special` → Pêche (--a2)

**Dates multiples** (ex. semaine de congé) :
```javascript
{ date: "2027-03-01", end: "2027-03-05", cat: "conge", label: "Congé de mars" }
```

### Changer l'horaire

Dans `calendar.js`, modifiez `SCHEDULE_ROWS` :

```javascript
const SCHEDULE_ROWS = [
  { type: "cours", heure: "8h15-8h55", lbl: "Cours 1" },
  // Ajouter, retirer, ou changer les heures
];
```

### Changer les polices

Dans `style.css`, cherchez `font-family` :

```css
font-family: 'Caveat', cursive;      /* Handwriting */
font-family: 'Quicksand', sans-serif; /* Body text */
```

Remplacez par vos Google Fonts (ajustez aussi le `<link>` dans `index.html`).

### Ajouter une couverture

Dans `calendar.js`, créez une fonction `renderCover()` et appelez-la au début de `generateFullYear()` dans `script.js` :

```javascript
function renderCover() {
  return `<div class="page" style="display: flex; align-items: center; justify-content: center;">
    <h1 style="font-family: Caveat; font-size: 60px;">Mon Agenda Pédago</h1>
  </div>`;
}
```

---

## 💡 Astuces

### Impression optimale

1. **Ouvrez le preview** → Utilisez le bouton **🖨️ Imprimer / PDF**
2. **Réglez les marges** : 0.22" (comme dans le CSS)
3. **Format papier** : Letter (8.5" × 11")
4. **Orientation** : Portrait
5. **Fond** : Si nécessaire, cochez "Fond et images" dans vos options

### Sauvegarde locale automatique

Les données restent dans votre navigateur pour la session actuelle. Pour une sauvegarde permanente :
1. Remplissez votre planner
2. Cliquez **💾 Enregistrer mon planner**
3. Téléchargez le JSON
4. Plus tard : cliquez **📂 Reprendre**, ouvrez le fichier

### Export Canva

Après export PNG :
1. Créez un nouveau design Letter (8.5" × 11") dans Canva
2. Importez une page PNG
3. Dimensionnez-la pour remplir la toile
4. Explorez les 84 pages pour votre planner

### GitHub Pages

Ce projet est prêt pour GitHub Pages :
1. Allez à votre repo → **Settings** → **Pages**
2. Sélectionnez **Deploy from a branch** → **main**
3. Attendez quelques secondes
4. Votre site est live : `https://monicamorinn.github.io/mon-agenda-pedago/`

---

## 🐛 Dépannage

**Q: L'aperçu ne se met pas à jour quand je clique sur un réglage**  
A: Rechargez la page (Ctrl+F5). Vérifiez que tous les fichiers `.js` sont chargés.

**Q: Les événements DSFS ne s'affichent pas**  
A: Vérifiez que les dates dans `calendar.js` sont correctes (format `YYYY-MM-DD`).

**Q: L'export PNG prend beaucoup de temps**  
A: C'est normal pour 84 pages. Attendez quelques minutes, les fichiers se téléchargent progressivement.

**Q: Les couleurs N&B ne fonctionnent pas**  
A: Assurez-vous d'avoir cliqué sur la palette **"Noir et blanc"** avant de générer.

**Q: Je ne peux pas modifier les cases dans l'aperçu**  
A: L'aperçu est en lecture seule. Générez d'abord (bouton "Générer"), puis modifiez le plein écran.

---

## 📝 Notes de version

**v1.0** (2026-07-17)
- Structure initiale : 5 fichiers séparés
- 42 semaines 2026-2027 avec événements DSFS
- Export PNG, PDF, Word
- Save/Load JSON
- Palette personnalisable

---

## 📧 Support

Pour questions ou améliorations, créez une **issue** dans le repository GitHub.

---

**Bonne planification ! 📅✨**
