# Local Development Setup — Rotana Store

> Follow these steps to get the project running on your machine.

---

## Prerequisites

| Tool    | Version  | Install                                                |
| ------- | -------- | ------------------------------------------------------ |
| Node.js | ≥ 20 LTS | [nodejs.org](https://nodejs.org)                       |
| pnpm    | ≥ 9.x    | `npm install -g pnpm`                                  |
| Git     | ≥ 2.40   | [git-scm.com](https://git-scm.com)                     |
| VS Code | Latest   | [code.visualstudio.com](https://code.visualstudio.com) |

> **Package manager**: This project uses **pnpm** exclusively. Do NOT use `npm install` or `yarn` — they will create wrong lockfiles and break CI.

### Recommended VS Code Extensions

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Prisma (`Prisma.prisma`)
- GitLens (`eamodio.gitlens`)
- Error Lens (`usernamehw.errorlens`)

---

## Step 1: Clone the Repo

```bash
git clone https://github.com/<org>/ROTANA-WEB-APP.git
cd ROTANA-WEB-APP
```

## Step 2: Install Dependencies

```bash
pnpm install
```

## Step 3: Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Now fill in the values. Get them from the **Google Chat pinned message** in the team group.

| Variable                        | Where to Get                             |
| ------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Dashboard → Settings → API      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Google Chat pinned message               |
| `DATABASE_URL`                  | Supabase Dashboard → Settings → Database |
| `DIRECT_URL`                    | Supabase Dashboard → Settings → Database |
| `NEXTAUTH_SECRET`               | Google Chat pinned message               |
| `RAZORPAY_KEY_ID`               | Razorpay Dashboard                       |
| `RAZORPAY_KEY_SECRET`           | Google Chat pinned message               |
| `RAZORPAY_WEBHOOK_SECRET`       | Google Chat pinned message               |

> **⚠️ NEVER commit `.env.local` to Git.** It is in `.gitignore` by default.
> See `.rules/PROJECT_CANON.md` Section 8 for the complete list of all environment variables.

## Step 4: Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed the database with test data
pnpm db:seed
```

## Step 5: Start Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Next.js app serves both the **web UI** and the **API routes** (`/api/v1/...`) from the same server on port 3000.

---

## Common Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start Next.js dev server (web + API) |
| `pnpm build`        | Build for production                 |
| `pnpm start`        | Run production build locally         |
| `pnpm lint`         | Run ESLint                           |
| `pnpm format`       | Format all files with Prettier       |
| `pnpm format:check` | Check formatting without writing     |
| `pnpm type-check`   | Run TypeScript type checking         |
| `pnpm test`         | Run all unit tests (Vitest)          |
| `pnpm test:e2e`     | Run E2E tests (Playwright)           |
| `pnpm db:generate`  | Generate Prisma client               |
| `pnpm db:migrate`   | Run database migrations              |
| `pnpm db:seed`      | Seed database with test data         |
| `pnpm db:studio`    | Open Prisma Studio (DB browser GUI)  |
| `pnpm db:reset`     | ⚠️ RESET DB — deletes all data!      |

---

## Troubleshooting

### `pnpm install` fails

```bash
# Clear the pnpm store and try again
pnpm store prune
rm -rf node_modules
pnpm install
```

### Prisma errors

```bash
# Regenerate the Prisma client
pnpm db:generate

# Reset the database (⚠️ DELETES ALL DATA)
pnpm db:reset
```

### Port already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Environment variable issues

- Make sure `.env.local` exists and has all required variables
- Restart the dev server after changing env vars
- `NEXT_PUBLIC_*` vars require a full server restart (no hot reload for these)

### "Cannot find module" after adding a new lib/ file

```bash
# Restart the TypeScript server in VS Code
# Command Palette → "TypeScript: Restart TS Server"
```

---

## Git Workflow Quick Reference

```bash
# 1. Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/ROT-12-add-cart

# 2. Work on your feature (commit often)
git add .
git commit -m "feat(cart): add quantity selector component"

# 3. Push and create a PR
git push origin feature/ROT-12-add-cart
# → Open PR on GitHub targeting 'develop'

# 4. After PR is approved and merged
git checkout develop
git pull origin develop
git branch -d feature/ROT-12-add-cart
```

---

_Questions? Ask in the Google Chat team group._
