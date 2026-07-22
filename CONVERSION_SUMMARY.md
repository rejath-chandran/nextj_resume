# Resume Builder AI - Next.js 16 with ReactBits Animations

Successfully converted Go application to Next.js 16 with animated UI components.

## Project Location
```
/Users/rejatharathi/Desktop/resume_builder_ai/nextjs-app/
```

## Tech Stack
- **Framework**: Next.js 16.2.11 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Base Nova style)
- **Animations**: ReactBits-inspired custom animations
- **Database**: SQLite with Prisma 7 ORM (libsql adapter)
- **Icons**: Lucide React

## Features

### Core Pages
1. **Landing Page** (`/`) - Animated hero section with features
2. **Resume Builder** (`/builder`) - Full-featured resume editor with real-time preview
3. **Resumes List** (`/resumes`) - Manage all saved resumes

### Animated Components (`src/components/animations.tsx`)
- `FadeIn` - Fade in from below with intersection observer
- `ScaleIn` - Scale up animation
- `SlideIn` - Slide from any direction (left/right/up/down)
- `BlurIn` - Blur to focus animation
- `Stagger` - Stagger children animations
- `GlowEffect` - Glowing hover effect
- `Magnetic` - Magnetic pull effect on hover
- `TextReveal` - Word-by-word text reveal
- `GradientText` - Animated gradient text
- `ShimmerText` - Shimmer effect text

### Database Models
- PersonalInfo
- Experience
- Education
- Skill
- Project
- Certification

### API Routes
- `/api/resumes` - Personal info CRUD
- `/api/experiences` - Work experience CRUD
- `/api/education` - Education CRUD
- `/api/skills` - Skills CRUD
- `/api/projects` - Projects CRUD
- `/api/certifications` - Certifications CRUD

## Getting Started

```bash
cd nextjs-app

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

Open http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Key Files

```
src/
├── app/
│   ├── page.tsx              # Landing page with animations
│   ├── builder/page.tsx      # Resume builder with tabs
│   └── resumes/page.tsx      # Resume list
├── components/
│   ├── animations.tsx        # ReactBits-inspired animations
│   ├── sections.tsx          # Resume section components
│   ├── resume-preview.tsx    # Live preview component
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── db.ts                 # Prisma client with libsql adapter
└── types/
    └── resume.ts             # TypeScript interfaces
```

## Configuration

### ReactBits Registry (components.json)
```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

Note: The ReactBits CDN endpoint returns HTML instead of JSON, so custom animations were created that follow ReactBits' animation patterns.

## Animations Used

The landing page features:
- Fade-in hero section
- Gradient animated text
- Magnetic hover effects on buttons
- Staggered feature cards
- Glow effects on hover
- Slide-in navigation
- Scale-in preview cards

The builder page features:
- Tab transitions with slide animations
- Scale-in cards on tab change
- Gradient headers
- Magnetic export button

## Environment Variables

- `DATABASE_URL`: SQLite database path (default: `file:./prisma/dev.db`)

## Next Steps

To add more ReactBits components when the registry becomes available:
1. Visit https://reactbits.dev
2. Browse component library
3. Use: `npx shadcn@latest add "@react-bits/[component-name]"`

## License

MIT
