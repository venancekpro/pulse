# PULSE Design Tokens

Tokens CSS prets a integrer. Copier dans `:root` pour application globale.

---

## Couleurs

```css
:root {
  /* === Fond et surfaces === */
  --bg-base: #F5E6D3;
  --bg-gradient-start: #F5E6D3;
  --bg-gradient-mid: #EDE0D4;
  --bg-gradient-end: #E8D5C4;
  --surface-card: #FFFFFF;
  --surface-sidebar: #FAF6F1;
  --surface-input: #F9F5F0;
  --surface-hover: #F3EDE6;
  --surface-dark: #1E1E2E;
  --surface-dark-secondary: #2A2A3C;

  /* === Accents === */
  --accent-primary: #D4763C;
  --accent-primary-hover: #C06830;
  --accent-primary-light: rgba(212, 118, 60, 0.12);
  --accent-secondary: #F4A261;
  --accent-secondary-light: rgba(244, 162, 97, 0.12);
  --accent-coral: #E07A5F;
  --accent-coral-light: rgba(224, 122, 95, 0.12);

  /* === Texte === */
  --text-primary: #1A1A2E;
  --text-secondary: #5A5A6E;
  --text-muted: #8B8B9E;
  --text-light: #B8B8C8;
  --text-on-dark: #FFFFFF;
  --text-on-accent: #FFFFFF;

  /* === Bordures === */
  --border-default: #E8DDD2;
  --border-light: #F0E8DF;
  --border-focus: #D4763C;
  --border-dark: rgba(255, 255, 255, 0.1);

  /* === Semantique === */
  --success: #4CAF50;
  --success-soft: rgba(76, 175, 80, 0.12);
  --warning: #F4A261;
  --warning-soft: rgba(244, 162, 97, 0.12);
  --error: #C44D3D;
  --error-soft: rgba(196, 77, 61, 0.12);
  --info: #5B8DEF;
  --info-soft: rgba(91, 141, 239, 0.12);

  /* === Charge (metier) === */
  --load-normale: #4CAF50;
  --load-normale-soft: rgba(76, 175, 80, 0.12);
  --load-moderee: #F4A261;
  --load-moderee-soft: rgba(244, 162, 97, 0.12);
  --load-elevee: #E07A5F;
  --load-elevee-soft: rgba(224, 122, 95, 0.12);
  --load-critique: #C44D3D;
  --load-critique-soft: rgba(196, 77, 61, 0.12);

  /* === Poles === */
  --pole-front: #A78BFA;
  --pole-front-soft: rgba(167, 139, 250, 0.12);
  --pole-back: #5B8DEF;
  --pole-back-soft: rgba(91, 141, 239, 0.12);
  --pole-devops: #F4A261;
  --pole-devops-soft: rgba(244, 162, 97, 0.12);
  --pole-ux: #F472B6;
  --pole-ux-soft: rgba(244, 114, 182, 0.12);

  /* === KPI === */
  --kpi-members: #D4763C;
  --kpi-members-soft: rgba(212, 118, 60, 0.12);
  --kpi-projects: #5B8DEF;
  --kpi-projects-soft: rgba(91, 141, 239, 0.12);
  --kpi-activity: #A78BFA;
  --kpi-activity-soft: rgba(167, 139, 250, 0.12);
}
```

---

## Typographie

```css
:root {
  /* === Familles === */
  --font-heading: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* === Tailles === */
  --text-display: 2.25rem;    /* 36px */
  --text-h1: 1.75rem;         /* 28px */
  --text-h2: 1.5rem;          /* 24px */
  --text-h3: 1.25rem;         /* 20px */
  --text-body: 1rem;          /* 16px */
  --text-sm: 0.875rem;        /* 14px */
  --text-xs: 0.75rem;         /* 12px */

  /* === Line-heights === */
  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* === Poids === */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

---

## Espacement

```css
:root {
  --space-0: 0;
  --space-0-5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1-5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  --space-2-5: 0.625rem;   /* 10px */
  --space-3: 0.75rem;      /* 12px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-8: 2rem;         /* 32px */
  --space-10: 2.5rem;      /* 40px */
  --space-12: 3rem;        /* 48px */
  --space-16: 4rem;        /* 64px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */
}
```

---

## Border radius

```css
:root {
  --radius-sm: 0.5rem;     /* 8px */
  --radius-md: 0.75rem;    /* 12px */
  --radius-lg: 1rem;       /* 16px */
  --radius-xl: 1.25rem;    /* 20px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

---

## Ombres

```css
:root {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 8px 30px rgba(0, 0, 0, 0.10);
  --shadow-elevated: 0 12px 40px rgba(0, 0, 0, 0.12);
  --shadow-accent: 0 4px 16px rgba(212, 118, 60, 0.25);
  --shadow-dark-card: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## Transitions

```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease-out;
  --transition-slow: 300ms ease;
  --transition-theme: 700ms ease-out;
}
```

---

## Z-index

```css
:root {
  --z-base: 0;
  --z-card: 1;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-sidebar: 30;
  --z-modal: 40;
  --z-toast: 50;
}
```

---

## Fond de page

```css
body {
  background: linear-gradient(135deg,
    var(--bg-gradient-start) 0%,
    var(--bg-gradient-mid) 50%,
    var(--bg-gradient-end) 100%
  );
  background-attachment: fixed;
  color: var(--text-primary);
  font-family: var(--font-body);
}

/* Overlay radial optionnel pour effet lumineux */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 50% at 70% 20%,
    rgba(244, 162, 97, 0.06),
    transparent 60%
  );
  pointer-events: none;
  z-index: -1;
}
```

---

## Mapping vers Tailwind

Pour utiliser ces tokens avec Tailwind, ajouter dans la config :

```js
theme: {
  extend: {
    colors: {
      'bg-base': 'var(--bg-base)',
      'surface': {
        card: 'var(--surface-card)',
        sidebar: 'var(--surface-sidebar)',
        input: 'var(--surface-input)',
        hover: 'var(--surface-hover)',
        dark: 'var(--surface-dark)',
      },
      'accent': {
        primary: 'var(--accent-primary)',
        'primary-hover': 'var(--accent-primary-hover)',
        secondary: 'var(--accent-secondary)',
        coral: 'var(--accent-coral)',
      },
      'text': {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
    },
    fontFamily: {
      heading: ['DM Serif Display', 'Georgia', 'serif'],
      body: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      '2xl': 'var(--radius-2xl)',
    },
    boxShadow: {
      card: 'var(--shadow-card)',
      'card-hover': 'var(--shadow-card-hover)',
      elevated: 'var(--shadow-elevated)',
      accent: 'var(--shadow-accent)',
    },
  },
}
```
