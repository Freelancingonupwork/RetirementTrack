# RetirementTrack Discovery Prototype

RetirementTrack is a React and TypeScript prototype for Harbor Wealth. It demonstrates four connected retirement-planning experiences: Client, Advisor, Firm Administrator, and Platform Administrator.

## Run the application

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/login`.

## GitHub Pages preview

The `Deploy RetirementTrack to GitHub Pages` workflow publishes the current
`main` branch to:

`https://freelancingonupwork.github.io/RetirementTrack/`

In the GitHub repository, set **Settings → Pages → Build and deployment →
Source** to **GitHub Actions**. Each push to `main` will then rebuild and update
the preview automatically.

## Validate

```bash
npm run build
npm test
```

## Role previews

- Client: `/client/dashboard`
- Advisor: `/advisor/dashboard`
- Firm administrator: `/admin/overview`
- Platform administrator: `/platform/dashboard`

The login page also provides links to each role preview.

## Documentation

See [IMPLEMENTATION_CONTEXT.md](./IMPLEMENTATION_CONTEXT.md) for the complete product context, routes, state transitions, role workflows, design system, accessibility behavior, prototype boundaries, and recommended next decisions.

## Prototype boundary

All data is fictional and stored in browser `localStorage`. The prototype does not implement real authentication, backend APIs, tenant isolation, scheduling, calendar integration, SMS, email delivery, or production financial logic.
