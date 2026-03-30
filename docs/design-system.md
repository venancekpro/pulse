# PULSE Design System

## Philosophie

Le design system PULSE s'inspire d'une esthetique **chaleureuse et professionnelle** : des tons creme et beige en fond, des accents orange/terracotta, et surtout un **glassmorphisme** omnipresent — les cartes, badges, sections et la navigation sont semi-transparentes avec un flou d'arriere-plan (`backdrop-filter: blur`), laissant entrevoir les gradients et les taches de couleur decoratives du fond. La typographie serif elegante pour les titres complete l'ensemble.

**Principes directeurs :**

1. **Glassmorphisme** — Tous les panneaux et cartes sont semi-transparents avec `backdrop-blur`, laissant le fond chaud transparaitre
2. **Chaleur** — Palette chaude (creme, beige, terracotta) au lieu de gris froids, avec des taches colorees decoratives en arriere-plan
3. **Clarte** — Hierarchie visuelle nette grace aux niveaux de transparence (subtle → standard → strong)
4. **Elegance** — Titres serif, coins genereux, bordures blanches semi-opaques
5. **Contraste maitrise** — Accent dark navy en glass sombre pour les elements actifs et les sections d'accroche
6. **Espace** — Marges genereuses, contenu aere

---

## Palette de couleurs

### Fond et surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#F5E6D3` | Fond de page principal |
| `--bg-gradient-start` | `#F5E6D3` | Debut du gradient de fond |
| `--bg-gradient-mid` | `#EDE0D4` | Milieu du gradient |
| `--bg-gradient-end` | `#E8D5C4` | Fin du gradient |
| `--surface-card` | `#FFFFFF` | Fond des cartes |
| `--surface-sidebar` | `#FAF6F1` | Fond de la sidebar |
| `--surface-input` | `#F9F5F0` | Fond des champs de saisie |
| `--surface-hover` | `#F3EDE6` | Fond au survol |
| `--surface-dark` | `#1E1E2E` | Fond des cartes sombres (ex: Upcoming Meeting) |

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | `#D4763C` | Accent principal — boutons, liens actifs, icones |
| `--accent-primary-hover` | `#C06830` | Accent au survol |
| `--accent-secondary` | `#F4A261` | Accent secondaire — badges, highlights |
| `--accent-coral` | `#E07A5F` | Barres de progression, graphiques |
| `--accent-warm` | `#F4A261` | Elements decoratifs chauds |

### Texte

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#1A1A2E` | Texte principal (titres, corps) |
| `--text-secondary` | `#5A5A6E` | Texte secondaire (descriptions, labels) |
| `--text-muted` | `#8B8B9E` | Texte desactive, placeholders |
| `--text-light` | `#B8B8C8` | Texte tres leger (hints) |
| `--text-on-dark` | `#FFFFFF` | Texte sur fond sombre |
| `--text-on-accent` | `#FFFFFF` | Texte sur accent primaire |

### Bordures

| Token | Hex | Usage |
|-------|-----|-------|
| `--border-default` | `#E8DDD2` | Bordure standard des cartes et inputs |
| `--border-light` | `#F0E8DF` | Bordure legere (separateurs) |
| `--border-focus` | `#D4763C` | Bordure au focus (inputs) |

### Semantique

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#4CAF50` | Succes, validation |
| `--success-soft` | `rgba(76, 175, 80, 0.12)` | Fond succes leger |
| `--warning` | `#F4A261` | Avertissement |
| `--warning-soft` | `rgba(244, 162, 97, 0.12)` | Fond avertissement |
| `--error` | `#C44D3D` | Erreur, critique |
| `--error-soft` | `rgba(196, 77, 61, 0.12)` | Fond erreur leger |
| `--info` | `#5B8DEF` | Information |
| `--info-soft` | `rgba(91, 141, 239, 0.12)` | Fond info |

### Niveaux de charge (metier)

| Token | Hex | Usage |
|-------|-----|-------|
| `--load-normale` | `#4CAF50` | Charge 0-60% |
| `--load-moderee` | `#F4A261` | Charge 61-80% |
| `--load-elevee` | `#E07A5F` | Charge 81-100% |
| `--load-critique` | `#C44D3D` | Charge >100% |

### Poles d'equipe

| Token | Hex | Usage |
|-------|-----|-------|
| `--pole-front` | `#A78BFA` | Pole Frontend |
| `--pole-back` | `#5B8DEF` | Pole Backend |
| `--pole-devops` | `#F4A261` | Pole DevOps |
| `--pole-ux` | `#F472B6` | Pole UX/UI |

---

## Typographie

### Familles de polices

| Usage | Police | Poids | Variable CSS |
|-------|--------|-------|--------------|
| Titres (H1, H2) | DM Serif Display | 400 | `--font-heading` |
| Corps, UI, labels | DM Sans | 400, 500, 600, 700 | `--font-body` |
| Code, valeurs techniques | JetBrains Mono | 400, 500 | `--font-mono` |

### Echelle typographique

| Token | Taille | Line-height | Usage |
|-------|--------|-------------|-------|
| `--text-display` | 36px | 1.2 | Titre de page ("Dashboard") |
| `--text-h1` | 28px | 1.3 | Titres de section |
| `--text-h2` | 24px | 1.3 | Sous-titres |
| `--text-h3` | 20px | 1.4 | Titres de carte |
| `--text-body` | 16px | 1.5 | Corps de texte |
| `--text-sm` | 14px | 1.5 | Labels, descriptions |
| `--text-xs` | 12px | 1.5 | Badges, hints, metadata |

### Poids

| Token | Valeur | Usage |
|-------|--------|-------|
| `--font-normal` | 400 | Corps de texte, titres serif |
| `--font-medium` | 500 | Labels, titres de carte |
| `--font-semibold` | 600 | Boutons, liens, badges |
| `--font-bold` | 700 | Accents forts, KPI chiffres |

---

## Glassmorphisme

Le glassmorphisme est l'element central du design system. Chaque panneau, carte et section utilise une transparence avec blur pour creer un effet de verre depoli.

### Niveaux de glass

| Classe | Background | Blur | Bordure | Usage |
|--------|-----------|------|---------|-------|
| `.glass-subtle` | `rgba(255,255,255, 0.35)` | `blur(16px) saturate(160%)` | `rgba(255,255,255, 0.3)` | Sections, footer, trust bar |
| `.glass` | `rgba(255,255,255, 0.55)` | `blur(20px) saturate(180%)` | `rgba(255,255,255, 0.45)` | Cartes standard, feature cards |
| `.glass-strong` | `rgba(255,255,255, 0.7)` | `blur(24px) saturate(200%)` | `rgba(255,255,255, 0.5)` | Cartes principales, simulator, CTA |
| `.glass-dark` | `rgba(30,30,46, 0.75)` | `blur(24px) saturate(180%)` | `rgba(255,255,255, 0.08)` | Section stats sur fond sombre |
| `.glass-nav` | `rgba(255,255,255, 0.5)` | `blur(20px) saturate(180%)` | Bordure basse `rgba(255,255,255, 0.35)` | Navbar sticky |
| `.glass-inner` | `rgba(255,255,255, 0.4)` | `blur(8px)` | `rgba(255,255,255, 0.35)` | Elements internes (KPI, sous-cartes) |
| `.glass-badge` | `rgba(255,255,255, 0.5)` | `blur(12px)` | `rgba(255,255,255, 0.4)` | Badges, pills, chips |

### Taches decoratives (blobs)

Pour que l'effet de verre soit visible, il faut des **taches de couleur** en arriere-plan qui transparaissent a travers le glass :

```css
/* Exemples de blobs decoratifs */
.blob-orange { background: rgba(244, 162, 97, 0.15); filter: blur(60px); }
.blob-coral  { background: rgba(224, 122, 95, 0.12); filter: blur(60px); }
.blob-primary { background: rgba(212, 118, 60, 0.10); filter: blur(60px); }
```

Placer 2-3 blobs par section en `position: absolute` avec `border-radius: 50%` et des tailles de 300-600px. Animer avec un flottement lent (`animation: float 6s ease-in-out infinite`).

### Effet shine (optionnel)

Un reflet lumineux qui traverse la carte au hover :

```css
.glass-shine::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.6s ease;
}
.glass-shine:hover::before { left: 100%; }
```

---

## Espacement

Systeme base sur une unite de 4px.

| Token | Valeur | Usage |
|-------|--------|-------|
| `--space-1` | 4px | Micro-espacement (icone-texte) |
| `--space-2` | 8px | Espacement interne compact |
| `--space-3` | 12px | Padding badges, gap compact |
| `--space-4` | 16px | Padding standard composants |
| `--space-5` | 20px | Gap entre elements |
| `--space-6` | 24px | Padding cartes, sections |
| `--space-8` | 32px | Separation entre sections |
| `--space-10` | 40px | Grande separation |
| `--space-12` | 48px | Marge entre blocs majeurs |
| `--space-16` | 64px | Espacement hero/sections landing |

---

## Border radius

| Token | Valeur | Usage |
|-------|--------|-------|
| `--radius-sm` | 8px | Badges, petits elements |
| `--radius-md` | 12px | Inputs, boutons, dropdowns |
| `--radius-lg` | 16px | Cartes secondaires |
| `--radius-xl` | 20px | Cartes principales |
| `--radius-2xl` | 24px | Grands conteneurs |
| `--radius-full` | 9999px | Avatars, pills, badges arrondis |

---

## Ombres

| Token | Valeur | Usage |
|-------|--------|-------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.04)` | Inputs, petits elements |
| `--shadow-card` | `0 4px 20px rgba(0,0,0,0.06)` | Cartes standard |
| `--shadow-card-hover` | `0 8px 30px rgba(0,0,0,0.10)` | Cartes au survol |
| `--shadow-elevated` | `0 12px 40px rgba(0,0,0,0.12)` | Modals, dropdowns |
| `--shadow-accent` | `0 4px 16px rgba(212, 118, 60, 0.25)` | Boutons accent au survol |
| `--shadow-dark-card` | `0 8px 32px rgba(0,0,0,0.3)` | Cartes sombres |

---

## Fond de page

Le fond utilise un gradient chaud avec un effet mesh subtil :

```css
background: linear-gradient(135deg, #F5E6D3 0%, #EDE0D4 50%, #E8D5C4 100%);
```

Optionnellement, un gradient radial en overlay pour un effet lumineux :

```css
background-image:
  radial-gradient(ellipse 80% 50% at 70% 20%, rgba(244, 162, 97, 0.08), transparent 60%),
  linear-gradient(135deg, #F5E6D3 0%, #EDE0D4 50%, #E8D5C4 100%);
background-attachment: fixed;
```

---

## Transitions et animations

| Token | Valeur | Usage |
|-------|--------|-------|
| `--transition-fast` | `150ms ease` | Hover etats interactifs |
| `--transition-normal` | `200ms ease-out` | Boutons, inputs |
| `--transition-slow` | `300ms ease` | Cartes, ouverture/fermeture |

### Hover sur les cartes

```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
```

### Hover sur les boutons

```css
.btn:hover {
  transform: scale(1.02);
}
.btn:active {
  transform: scale(0.98);
}
```

---

## Z-index

| Token | Valeur | Usage |
|-------|--------|-------|
| `--z-base` | 0 | Elements normaux |
| `--z-card` | 1 | Cartes empilees |
| `--z-dropdown` | 10 | Menus deroulants |
| `--z-sticky` | 20 | Navbar sticky |
| `--z-sidebar` | 30 | Sidebar mobile |
| `--z-modal` | 40 | Modals |
| `--z-toast` | 50 | Notifications toast |

---

## Guidelines generales

### Do

- Utiliser les tons chauds pour le fond et les elements decoratifs
- Preferer les cartes blanches avec ombres douces sur le fond beige
- Utiliser le serif (DM Serif Display) uniquement pour les grands titres
- Maintenir un contraste suffisant (WCAG AA minimum)
- Arrondir genereuement les coins (minimum 12px pour les composants)
- Espacer les elements avec generosite

### Don't

- Ne pas utiliser de fond gris froid ou bleu
- Ne pas melanger trop de couleurs vives — rester dans la palette chaude
- Ne pas utiliser le serif pour le texte courant ou les labels
- Ne pas reduire les border-radius en dessous de 8px
- Ne pas surcharger les ombres (rester subtil)
- Ne pas utiliser de cartes completement opaques sans transparence — tout doit etre en glass
- Ne pas oublier les blobs decoratifs en arriere-plan — sans eux le glass est invisible
- Ne pas depasser `rgba(255,255,255, 0.8)` pour garder la transparence visible
