# OutSystems-like Shadow DOM AUT (Mock)

This project is a **realistic AUT** to stress-test automation against **deep nested Shadow DOM**, mimicking common OutSystems UI patterns:
- Screens + Blocks + Sections + Cards
- Aggregates (async fetch) + skeleton loading
- Client Actions (Search, Refresh, Save)
- FeedbackMessage auto-hide
- Navigation + route parameters + Prepare-for-Navigation
- Mixed ShadowRoots (some wrappers/blocks are `closed` to simulate "hard mode")

## Run
```bash
npm i
npm run dev
```
Open: http://localhost:5173/#/customers

## E2E (Playwright)
```bash
npm run test:e2e
```

## Notes on Shadow DOM realism
- `os-app-shell` uses a **closed** ShadowRoot (framework-owned root)
- `os-block` uses **closed** ShadowRoot by default (structural wrappers)
- Interactive elements (inputs/buttons) are still addressable via `data-test-id`
  - In real OutSystems projects, **stable test hooks** are essential. This mock enforces that.
