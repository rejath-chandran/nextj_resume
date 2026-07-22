# Resume Builder AI - Next.js 16

A modern, full-stack resume builder application built with Next.js 16, featuring real-time preview, PDF export, and a beautiful UI powered by shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Forms**: React Hook Form (ready to integrate)
- **Icons**: Lucide React

## Features

- Personal information management
- Work experience tracking
- Education history
- Skills categorization
- Project portfolio
- Professional certifications
- Real-time resume preview
- PDF export functionality
- Multiple resume support
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd nextjs-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── resumes/      # Resume CRUD operations
│   │   ├── experiences/  # Experience management
│   │   ├── education/    # Education management
│   │   ├── skills/       # Skills management
│   │   ├── projects/     # Projects management
│   │   └── certifications/ # Certifications management
│   ├── builder/          # Resume builder page
│   ├── resumes/          # Resume list page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── sections.tsx      # Resume section components
│   └── resume-preview.tsx # Preview component
├── lib/
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
└── types/
    └── resume.ts         # TypeScript types
```

## API Endpoints

### Resumes
- `GET /api/resumes` - List all resumes
- `GET /api/resumes?id=<id>` - Get single resume with all data
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes` - Update resume
- `DELETE /api/resumes?id=<id>` - Delete resume

### Experiences
- `GET /api/experiences?personalInfoId=<id>` - List experiences
- `POST /api/experiences` - Create experience
- `PUT /api/experiences` - Update experience
- `DELETE /api/experiences?id=<id>` - Delete experience

### Education
- `GET /api/education?personalInfoId=<id>` - List education
- `POST /api/education` - Create education
- `PUT /api/education` - Update education
- `DELETE /api/education?id=<id>` - Delete education

### Skills
- `GET /api/skills?personalInfoId=<id>` - List skills
- `POST /api/skills` - Create skill
- `PUT /api/skills` - Update skill
- `DELETE /api/skills?id=<id>` - Delete skill

### Projects
- `GET /api/projects?personalInfoId=<id>` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects` - Update project
- `DELETE /api/projects?id=<id>` - Delete project

### Certifications
- `GET /api/certifications?personalInfoId=<id>` - List certifications
- `POST /api/certifications` - Create certification
- `PUT /api/certifications` - Update certification
- `DELETE /api/certifications?id=<id>` - Delete certification

## Database Schema

The application uses SQLite with the following tables:

- **personal_info**: Main resume information
- **experiences**: Work history
- **education**: Academic background
- **skills**: Categorized skills with proficiency levels
- **projects**: Portfolio projects
- **certifications**: Professional certifications

## Adding ReactBits Components

To add animated components from ReactBits:

1. Visit https://reactbits.dev
2. Browse available components
3. Follow the MCP integration instructions at https://reactbits.dev/get-started/mcp
4. Components will be available through the MCP protocol

## Development

### Adding new shadcn/ui components

```bash
npx shadcn@latest add [component-name]
```

### Running database migrations

```bash
npx prisma migrate dev --name [migration-name]
```

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Deployment

The application can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker

For production builds:

```bash
npm run build
npm start
```

## Environment Variables

- `DATABASE_URL`: SQLite database path (default: `file:./dev.db`)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
