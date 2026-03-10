# Externia — Web

Sitio web de Externia (Consultoría de IA para Eventos). Migrado a **SvelteKit + Svelte 5** para mejor rendimiento.

## Stack

- **SvelteKit** + **Svelte 5**
- **Tailwind CSS** v4
- **Three.js** (escena 3D del Hero)
- **@tsparticles** (partículas de red para páginas interiores)

## Estructura

```
/
├── static/          # Assets (logos, imágenes)
├── src/
│   ├── app.css      # Estilos globales + Tailwind
│   ├── app.html     # Shell HTML
│   ├── lib/
│   │   └── components/   # Componentes Svelte
│   │       ├── Navbar.svelte
│   │       ├── Footer.svelte
│   │       ├── ThemeToggle.svelte
│   │       ├── Scene3D.svelte   # Three.js + partículas
│   │       └── HeroContent.svelte
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte         # Home (Hero 3D)
│       ├── quienes-somos/
│       ├── servicios/
│       └── formacion/
└── build/           # Salida estática
```

## Comandos

| Comando | Acción |
|---------|--------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor desarrollo (localhost:5173) |
| `npm run build` | Build estático en `./build` |
| `npm run preview` | Previsualizar build |

## Estado de migración

- ✅ **Home**: Hero con escena 3D, logo animado, tema claro/oscuro
- ✅ **Navbar, Footer, ThemeToggle**: Completos
- ⏳ **Quiénes Somos, Servicios, Formación**: Páginas placeholder — contenido en migración

Los componentes React originales (`QuienesSomos.tsx`, `Formacion.tsx`, `Servicios.tsx`) permanecen en `src/components/` como referencia para completar la migración.
