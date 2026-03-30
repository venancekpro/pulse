# PULSE Component Catalog

Guide de reference pour les composants UI du design system PULSE.

---

## Boutons

### Variantes

#### Primary (accent orange)
```html
<button class="
  bg-[#D4763C] text-white font-semibold
  px-5 py-2.5 rounded-xl
  shadow-md
  hover:bg-[#C06830] hover:shadow-[0_4px_16px_rgba(212,118,60,0.25)]
  active:scale-[0.98]
  transition-all duration-200 ease-out
">
  Lancer la simulation
</button>
```

#### Secondary (outline)
```html
<button class="
  border border-[#E8DDD2] bg-white text-[#1A1A2E] font-semibold
  px-5 py-2.5 rounded-xl
  shadow-sm
  hover:bg-[#F3EDE6] hover:border-[#D4763C]/30
  active:scale-[0.98]
  transition-all duration-200 ease-out
">
  Annuler
</button>
```

#### Ghost
```html
<button class="
  text-[#5A5A6E] font-medium
  px-4 py-2 rounded-lg
  hover:bg-[#F3EDE6] hover:text-[#1A1A2E]
  transition-all duration-150
">
  Voir plus
</button>
```

#### Destructive
```html
<button class="
  bg-[#C44D3D]/10 text-[#C44D3D] font-semibold
  px-5 py-2.5 rounded-xl
  hover:bg-[#C44D3D]/20
  active:scale-[0.98]
  transition-all duration-200
">
  Supprimer
</button>
```

#### Icon Button
```html
<button class="
  size-10 rounded-xl
  border border-[#E8DDD2] bg-white
  flex items-center justify-center
  shadow-sm
  hover:bg-[#F3EDE6] hover:shadow-md
  transition-all duration-200
">
  <svg class="size-5 text-[#5A5A6E]">...</svg>
</button>
```

### Tailles

| Taille | Classes |
|--------|---------|
| xs | `px-3 py-1 text-xs h-7` |
| sm | `px-3.5 py-1.5 text-sm h-8` |
| default | `px-5 py-2.5 text-sm h-10` |
| lg | `px-6 py-3 text-base h-12` |

---

## Cartes

### Card standard
```html
<div class="
  bg-white rounded-[20px]
  border border-[#E8DDD2]
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
  p-6
  hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]
  hover:-translate-y-0.5
  transition-all duration-300
">
  <h3 class="font-heading text-xl text-[#1A1A2E]">Titre de la carte</h3>
  <p class="text-sm text-[#5A5A6E] mt-2">Description de la carte.</p>
</div>
```

### Card sombre (accent)
```html
<div class="
  bg-[#1E1E2E] rounded-[20px]
  shadow-[0_8px_32px_rgba(0,0,0,0.3)]
  p-6 text-white
">
  <h3 class="font-heading text-xl">Upcoming Meeting</h3>
  <p class="text-sm text-white/70 mt-2">Details...</p>
</div>
```

### Card KPI
```html
<div class="
  bg-white rounded-[20px]
  border border-[#E8DDD2]
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
  px-6 py-5
  flex items-center gap-4
">
  <div class="size-12 rounded-xl bg-[#D4763C]/10 flex items-center justify-center">
    <svg class="size-6 text-[#D4763C]">...</svg>
  </div>
  <div>
    <p class="text-sm text-[#8B8B9E]">Total Employees</p>
    <p class="text-2xl font-bold text-[#1A1A2E] tabular-nums">49,229</p>
  </div>
</div>
```

### Anatomie d'une carte

```
+----------------------------------------------+
|  CardHeader (px-6 pt-6 pb-0)                 |
|    CardTitle (font-heading text-lg)           |
|    CardDescription (text-sm text-secondary)   |
+----------------------------------------------+
|  CardContent (px-6 py-4)                      |
|    [contenu]                                  |
+----------------------------------------------+
|  CardFooter (px-6 pb-6 pt-0 border-t)        |
|    [actions]                                  |
+----------------------------------------------+
```

---

## Badges

### Variantes

#### Default (accent)
```html
<span class="
  inline-flex items-center h-6
  px-2.5 rounded-full
  bg-[#D4763C]/10 text-[#D4763C]
  text-xs font-medium
">
  Admin
</span>
```

#### Secondary
```html
<span class="
  inline-flex items-center h-6
  px-2.5 rounded-full
  bg-[#F3EDE6] text-[#5A5A6E]
  text-xs font-medium
">
  Viewer
</span>
```

#### Success
```html
<span class="
  inline-flex items-center h-6
  px-2.5 rounded-full
  bg-[#4CAF50]/10 text-[#4CAF50]
  text-xs font-medium
">
  Actif
</span>
```

#### Warning
```html
<span class="
  inline-flex items-center h-6
  px-2.5 rounded-full
  bg-[#F4A261]/10 text-[#D4763C]
  text-xs font-medium
">
  Charge elevee
</span>
```

#### Error
```html
<span class="
  inline-flex items-center h-6
  px-2.5 rounded-full
  bg-[#C44D3D]/10 text-[#C44D3D]
  text-xs font-medium
">
  Critique
</span>
```

#### Outline
```html
<span class="
  inline-flex items-center h-6
  px-2.5 rounded-full
  border border-[#E8DDD2] text-[#5A5A6E]
  text-xs font-medium
">
  Frontend
</span>
```

---

## Inputs

### Champ texte
```html
<div class="space-y-1.5">
  <label class="text-sm font-medium text-[#1A1A2E]">Nom du projet</label>
  <input
    type="text"
    placeholder="Saisir le nom..."
    class="
      w-full h-10 px-3 py-2
      bg-[#F9F5F0] border border-[#E8DDD2] rounded-xl
      text-sm text-[#1A1A2E]
      placeholder:text-[#B8B8C8]
      shadow-sm
      focus:border-[#D4763C] focus:ring-2 focus:ring-[#D4763C]/20
      hover:border-[#D4763C]/30
      transition-all duration-200
    "
  />
</div>
```

### Select
```html
<select class="
  h-10 px-3 py-2
  bg-[#F9F5F0] border border-[#E8DDD2] rounded-xl
  text-sm text-[#1A1A2E] font-medium
  shadow-sm
  focus:border-[#D4763C] focus:ring-2 focus:ring-[#D4763C]/20
  appearance-none
  cursor-pointer
">
  <option>Past 3 months</option>
</select>
```

---

## Sidebar

### Structure
```html
<aside class="
  w-64 min-h-screen
  bg-[#FAF6F1]
  border-r border-[#E8DDD2]
  flex flex-col
  p-4
">
  <!-- Logo -->
  <div class="flex items-center gap-3 px-3 h-14 mb-6">
    <div class="size-9 rounded-xl bg-[#D4763C] flex items-center justify-center">
      <svg class="size-5 text-white">...</svg>
    </div>
    <span class="text-lg font-bold text-[#1A1A2E]">PULSE</span>
  </div>

  <!-- Section label -->
  <p class="px-3 mb-2 text-xs font-medium text-[#8B8B9E] uppercase tracking-wider">
    Main Menu
  </p>

  <!-- Nav items -->
  <nav class="space-y-1">
    <!-- Active -->
    <a class="
      flex items-center gap-3 px-3 py-2.5 rounded-xl
      bg-[#1E1E2E] text-white font-medium text-sm
      shadow-md
    ">
      <svg class="size-5">...</svg>
      Dashboard
    </a>

    <!-- Inactive -->
    <a class="
      flex items-center gap-3 px-3 py-2.5 rounded-xl
      text-[#5A5A6E] text-sm
      hover:bg-[#F3EDE6] hover:text-[#1A1A2E]
      transition-colors duration-150
    ">
      <svg class="size-5">...</svg>
      Projets
    </a>
  </nav>
</aside>
```

---

## Tableaux

### Structure
```html
<div class="
  bg-white rounded-[20px]
  border border-[#E8DDD2]
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
  overflow-hidden
">
  <div class="px-6 py-4 border-b border-[#F0E8DF]">
    <h3 class="font-heading text-lg text-[#1A1A2E]">Employees</h3>
  </div>
  <table class="w-full">
    <thead>
      <tr class="border-b border-[#F0E8DF]">
        <th class="px-6 py-3 text-left text-xs font-medium text-[#8B8B9E] uppercase tracking-wider">
          ID
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-[#8B8B9E] uppercase tracking-wider">
          Name
        </th>
        <!-- ... -->
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[#F0E8DF]/50 hover:bg-[#F9F5F0] transition-colors">
        <td class="px-6 py-3 text-sm text-[#8B8B9E]">OM1246924</td>
        <td class="px-6 py-3 text-sm font-medium text-[#1A1A2E]">Judy Abbott</td>
        <!-- ... -->
      </tr>
    </tbody>
  </table>
</div>
```

---

## Barres de progression

### Charge membre
```html
<div class="flex items-center gap-3">
  <div class="flex-1 h-2 rounded-full bg-[#F3EDE6] overflow-hidden">
    <div
      class="h-full rounded-full bg-gradient-to-r from-[#E07A5F] to-[#C44D3D]"
      style="width: 75%"
    ></div>
  </div>
  <span class="text-xs font-semibold text-[#5A5A6E] tabular-nums w-10 text-right">75%</span>
</div>
```

### Barres de performance (style Dribbble)
```html
<div class="flex items-center gap-1">
  <div class="h-2 w-16 rounded-full bg-[#D4763C]"></div>
  <div class="h-2 w-12 rounded-full bg-[#E07A5F]"></div>
  <div class="h-2 w-4 rounded-full bg-[#F4A261]"></div>
</div>
```

---

## Avatars

### Avatar simple
```html
<div class="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
  <img src="..." alt="..." class="size-full object-cover" />
</div>
```

### Fallback initiales
```html
<div class="
  size-10 rounded-full
  bg-[#D4763C]/10 text-[#D4763C]
  flex items-center justify-center
  text-sm font-semibold
  border-2 border-white shadow-sm
">
  JA
</div>
```

### Groupe d'avatars
```html
<div class="flex -space-x-2">
  <div class="size-8 rounded-full border-2 border-white shadow-sm overflow-hidden">
    <img src="..." class="size-full object-cover" />
  </div>
  <div class="size-8 rounded-full border-2 border-white shadow-sm overflow-hidden">
    <img src="..." class="size-full object-cover" />
  </div>
  <div class="
    size-8 rounded-full border-2 border-white shadow-sm
    bg-[#F3EDE6] text-[#8B8B9E]
    flex items-center justify-center text-xs font-medium
  ">
    +3
  </div>
</div>
```

---

## Graphiques (Recharts)

### Palette de couleurs pour les graphiques

```typescript
const CHART_COLORS = {
  primary: '#D4763C',    // Barres principales
  secondary: '#F4A261',  // Barres secondaires
  coral: '#E07A5F',      // Accentuation
  muted: '#E8DDD2',      // Grille, axes
  text: '#8B8B9E',       // Labels
}
```

### Configuration Bar Chart
```typescript
<ResponsiveContainer width="100%" height={200}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DF" />
    <XAxis
      dataKey="month"
      tick={{ fill: '#8B8B9E', fontSize: 12 }}
      axisLine={{ stroke: '#E8DDD2' }}
      tickLine={false}
    />
    <YAxis
      tick={{ fill: '#8B8B9E', fontSize: 12 }}
      axisLine={false}
      tickLine={false}
    />
    <Bar
      dataKey="value"
      fill="#D4763C"
      radius={[4, 4, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
```

---

## Navbar

```html
<header class="
  h-14 px-6
  flex items-center justify-between
  bg-white/80 backdrop-blur-sm
  border-b border-[#E8DDD2]
  sticky top-0 z-20
">
  <!-- Page title -->
  <h1 class="font-heading text-[36px] text-[#1A1A2E]">Dashboard</h1>

  <!-- Right section -->
  <div class="flex items-center gap-3">
    <button class="size-10 rounded-xl border border-[#E8DDD2] bg-white flex items-center justify-center hover:bg-[#F3EDE6] transition-colors">
      <svg class="size-5 text-[#5A5A6E]"><!-- Bell icon --></svg>
    </button>
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8DDD2] bg-white">
      <div class="size-8 rounded-full overflow-hidden">
        <img src="..." class="size-full object-cover" />
      </div>
      <span class="text-sm font-medium text-[#1A1A2E]">Carla Sanford</span>
      <svg class="size-4 text-[#8B8B9E]"><!-- Chevron down --></svg>
    </div>
  </div>
</header>
```

---

## Notifications / Toast

### Style toast
```html
<div class="
  flex items-center gap-3
  bg-white rounded-xl
  border border-[#E8DDD2]
  shadow-[0_12px_40px_rgba(0,0,0,0.12)]
  px-4 py-3
  max-w-sm
">
  <div class="size-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
    <svg class="size-4 text-[#4CAF50]"><!-- Check icon --></svg>
  </div>
  <div>
    <p class="text-sm font-medium text-[#1A1A2E]">Projet cree</p>
    <p class="text-xs text-[#8B8B9E]">Le projet a ete ajoute avec succes.</p>
  </div>
</div>
```

---

## Stats / Working Format

### Stat row
```html
<div class="flex items-center justify-between py-3">
  <div>
    <p class="text-xs text-[#8B8B9E]">On-site</p>
    <p class="text-xl font-bold text-[#1A1A2E] tabular-nums">13,982</p>
  </div>
  <span class="
    px-3 py-1 rounded-full
    bg-[#D4763C]/10 text-[#D4763C]
    text-sm font-semibold tabular-nums
  ">
    11.4%
  </span>
</div>
```

---

## Dropdown / Menu

```html
<div class="
  bg-white rounded-xl
  border border-[#E8DDD2]
  shadow-[0_12px_40px_rgba(0,0,0,0.12)]
  py-2 min-w-[200px]
">
  <a class="
    flex items-center gap-2 px-4 py-2
    text-sm text-[#5A5A6E]
    hover:bg-[#F3EDE6] hover:text-[#1A1A2E]
    transition-colors duration-150
  ">
    <svg class="size-4">...</svg>
    Mon profil
  </a>
  <div class="h-px bg-[#F0E8DF] my-1"></div>
  <a class="
    flex items-center gap-2 px-4 py-2
    text-sm text-[#C44D3D]
    hover:bg-[#C44D3D]/5
    transition-colors duration-150
  ">
    <svg class="size-4">...</svg>
    Deconnexion
  </a>
</div>
```
