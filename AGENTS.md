# AGENTS.md

This file describes how coding agents should work in this repository.

The project is a TMS Cube Simulator frontend. The active architecture direction is documented in `refactor.md`; when implementation details are ambiguous, prefer the direction in `refactor.md` over older class/proxy experiments.

## Project Overview

- App type: frontend web application.
- Framework: React 19 + Vite.
- Language: TypeScript.
- Styling: Tailwind CSS v4, shadcn-style component structure, Radix UI primitives.
- State management: Zustand with Immer.
- Routing: React Router.
- Tests: Vitest.
- Deployment/runtime tooling: Cloudflare Vite plugin and Wrangler.

Main scripts:

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run deploy
```

Use `npm run build` for full TypeScript + production build verification when the change affects application behavior. Use `npm run test` when changing utility/domain logic with existing or added tests.

## Repository Structure

```text
src/
  assets/       Static assets, including enhancement item images.
  components/   Shared UI components and shadcn/Radix wrappers.
  contexts/     React contexts for dialog/workflow state sharing.
  data/         Raw data files, such as potential weights and registries.
  domains/      Domain data, feature logic, registries, and calculators.
  features/     User-facing feature UI sections and workflows.
  hooks/        React hooks that connect UI to stores/context/domain logic.
  lib/          Small shared library helpers.
  routes/       Page-level route components.
  store/        Zustand stores.
  utils/        Generic pure utilities and tests.
```

Important current domain areas:

- `src/domains/enhancement/cube/`: cube metadata and cube-related logic.
- `src/domains/enhancement/soul/`: soul metadata and roll logic.
- `src/domains/enhancement/moe/`: moe cube/card roll logic.
- `src/domains/equipment/`: equipment metadata and potential pool lookup.
- `src/domains/potential/`: potential metadata, resolving, validation, and formatting helpers.
- `src/domains/autoRoll/`: auto-roll matching/probability logic.

## Architecture Direction

The target direction is:

```text
Zustand Store
-> Sandbox / Dialog Session
-> Manager or Action Layer
-> Pure Feature Layer
-> RNG
```

Core rules:

- Store holds plain serializable data.
- Dialog/session owns high-frequency working copy changes.
- Feature/domain functions should be pure where practical.
- Random behavior must be injectable through an RNG abstraction.
- UI components should trigger actions and render state, not implement domain rules directly.

## State Management Rules

Use Zustand + Immer for global state.

Do:

- Store plain objects only.
- Keep equipment/moe instances serializable.
- Use `structuredClone` or an explicit copy function when creating dialog working copies.
- Commit dialog changes back through store actions such as `syncInstance`.

Avoid:

- Storing class instances in Zustand.
- Storing Valtio proxies in Zustand.
- Reading or mutating global store inside domain roll logic.
- Mutating store state directly from feature components except through existing store actions.

Current acceptable pattern:

```ts
const working = structuredClone(storeItem);
// mutate working inside dialog/session
syncInstance(working);
```

Long-term target:

```ts
type Session = {
  base: EquipmentInstance;
  working: EquipmentInstance;
  step: "idle" | "rolled" | "selecting";
  context: {
    rng: RNG;
    tempResult?: unknown;
    selectedIndices?: number[];
  };
};
```

## Domain Modeling Rules

Prefer data definitions plus pure functions.

For cubes, prefer:

- `CubeDefinition` plain TypeScript objects.
- Registry lookup functions.
- Pure roll functions.

Avoid cube class hierarchies unless a future requirement proves that a cube needs real runtime state. Most cube differences should be represented by fields such as `uiType`, `apply`, `rankUp`, `lineRank`, `minApplyTier`, `maxApplyTier`, and behavior keys.

Recommended shape:

```ts
type CubeDefinition = {
  id: CubeId;
  name: string;
  apply: PotentialFeature;
  uiType: "direct" | "restore" | "combine" | "hexa" | "accumulate";
  price: number;
  imagePath: string;
  rankUp: RankUpTable | null;
  lineRank: LineRankTable;
  minApplyTier?: EquipmentRank;
  maxApplyTier?: EquipmentRank;
};
```

Do not move cube metadata to JSON unless there is a clear need for non-TypeScript data editing. TypeScript object definitions are preferred because they support asset imports, union types, `satisfies`, and safer refactors.

## Equipment Special Cases

Do not introduce `WeaponEquipment`, `ArmorEquipment`, or similar subclasses for equipment rules.

Use capability/rule data instead:

- Short term: keep `features` / `capabilities` on equipment metadata.
- When a real exception appears: add a rule table or pure rule function.
- Keep equipment data as state, not behavior.

Preferred direction:

```ts
type EquipmentCapabilities = {
  mainPot: boolean;
  additionalPot: boolean;
  soul: boolean;
  starforce: boolean;
  scroll: boolean;
  starflame: boolean;
};
```

## RNG And Determinism

Randomness should be explicit and testable.

Do:

- Add or use an `RNG` interface.
- Pass `rng` into roll functions.
- Update weighted roll helpers to accept `rng`.

Avoid:

- Calling `Math.random()` inside domain logic.
- Reading randomness from hidden module state.

Target utility shape:

```ts
interface RNG {
  next(): number;
}

function rollWeightedIndex(weights: number[], rng: RNG): number {
  // rng.next() returns a number in [0, 1)
}
```

Production RNG can wrap `crypto.getRandomValues`. Tests and replay should use seeded RNG.

## UI And Workflow Rules

Feature UI lives under `src/features`.

UI components should:

- Render current working/session state.
- Trigger action functions.
- Keep visual-only state locally.

UI components should not:

- Decide rank-up behavior.
- Directly call low-level random roll helpers.
- Own multi-step enhancement rules permanently.
- Read global stores from domain logic.

Migration should be incremental. Start with direct cube workflows, then restore/combine/hexa/accumulate workflows.

Recommended action shape:

```ts
roll(session);
select(session, index);
apply(session);
cancel(session);
```

## Data And Metadata Rules

Use data files for raw external-like data:

- potential weights
- potential registries
- static source tables

Use TypeScript definitions for typed app metadata that imports assets or depends on union types:

- cube definitions
- enhancement item metadata
- equipment metadata
- UI behavior keys

Do not put formulas or executable behavior in JSON.

## TypeScript And Imports

- Use the `@/` alias for `src`.
- Prefer explicit domain types near their domain folder.
- Use `import type` for type-only imports.
- Prefer `satisfies` for metadata arrays where it improves type checking.
- Keep discriminated unions narrow and intentional.
- Avoid `any`; if unavoidable during migration, isolate it and leave a clear follow-up.

## React Guidelines

- Keep components focused on rendering and interaction.
- Put reusable UI primitives in `src/components`.
- Put feature-specific UI in `src/features`.
- Put cross-feature workflow logic in hooks or domain action modules, not deeply inside presentational components.
- Use Radix/shadcn components consistently with the existing component style.
- Use `lucide-react` for icons when needed.

## Styling Guidelines

- Tailwind CSS is the default styling tool.
- Prettier uses `prettier-plugin-tailwindcss`; class order is handled by formatting.
- Prefer existing component variants and utility helpers such as `cn`.
- Avoid unrelated redesigns during logic refactors.
- Keep UI changes scoped to the workflow being changed.

## Testing Guidelines

Add or update tests when changing:

- random/weighted selection utilities
- roll probability logic
- potential validation rules
- auto-roll matching
- data transformation helpers

Use seeded RNG in tests. Do not test probabilistic behavior with unbounded randomness.

Existing test location pattern:

```text
src/utils/*.test.ts
```

Domain tests may be added next to the domain module when practical.

## Refactor Priorities

Follow the staged plan in `refactor.md`.

Recommended order:

1. Add RNG abstraction.
2. Make `rollWeightedIndex` accept RNG.
3. Split cube metadata lookup from cube roll behavior.
4. Move cube roll behavior into pure functions.
5. Introduce equipment enhancement session.
6. Migrate cube workflows incrementally.
7. Apply the same RNG/session principles to soul and moe.

Do not start with:

- a full UI rewrite
- a generic FSM engine
- Valtio migration
- equipment class hierarchy
- cube class hierarchy
- moving all metadata to JSON

## Git And Branching Notes

- Prefer starting major refactors from `main`.
- Keep experimental architecture branches separate.
- Make PRs small enough to review behaviorally.
- Avoid mixing architecture refactors with visual redesigns.
- Do not delete legacy code until the replacement path is compiled, tested, and wired.

## Verification Checklist

Before finishing code changes, consider running:

```bash
npm run lint
npm run test
npm run build
```

If a command is not run, mention that in the final response.

For pure documentation changes, build/test is not required.

## Agent Behavior

When working in this repo:

- Read `refactor.md` before making architecture-level changes.
- Prefer `main` architecture over class/Valtio experiment branches unless explicitly instructed otherwise.
- Keep changes scoped.
- Preserve existing user changes.
- Do not silently revert unrelated files.
- If current code conflicts with this file, explain the conflict and choose the path aligned with `refactor.md`.
