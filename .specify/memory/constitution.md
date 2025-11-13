<!--
Sync Impact Report
Version change: NONE (initial) → 1.0.0
Modified principles: (initial establishment)
Added sections: Core Principles, Architectural Constraints, Delivery Workflow, Governance
Removed sections: None
Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/spec-template.md ✅ aligned (no changes required)
Follow-up TODOs: None
-->

# React TS Forms Component Library Constitution

## Core Principles

### 1. Accessibility & UX Fidelity (NON-NEGOTIABLE)
Components MUST meet WCAG 2.1 AA for focus, contrast, semantics, and keyboard navigation.
ARIA roles MUST be accurate; interactive elements MUST be reachable and operable via keyboard alone.
Visual states (hover, active, invalid, disabled, loading) MUST be explicit and test‑covered. Rationale: Ensures an inclusive,
predictable design system and prevents regressions that harm usability.

### 2. API Stability & Semantic Versioning
Public component props, exported types, and CSS variable names form the stable contract. Breaking changes REQUIRE a MAJOR bump
with migration notes. Additive, backward compatible enhancements use MINOR; documentation or internal refactors use PATCH.
Deprecated props MUST emit a development warning for ≥1 MINOR release before removal. Rationale: Predictable evolution builds
trust and reduces upgrade friction.

### 3. Test‑First Quality Discipline (NON-NEGOTIABLE)
Red‑Green‑Refactor enforced: write failing tests BEFORE implementation. Minimum coverage: 100% for critical logic paths,
≥90% overall lines, and a11y snapshots per component. Every exported component MUST have: unit tests (behavior & edge cases),
story/interaction test, and a11y checks. No merging if any new code lacks tests. Rationale: Prevents regressions and encodes
contract expectations as executable specifications.

### 4. Documentation & Discoverability
Each component MUST have: README section, Storybook stories (primary, variants, accessibility), prop tables auto‑generated,
and usage examples showing controlled/uncontrolled forms. New features MUST include changelog entry + migration guidance if
behavior alters usage patterns. Rationale: Reduces onboarding time and enables self‑service adoption.

### 5. Performance & Bundle Discipline
Components MUST be tree‑shakeable (no side‑effect imports); avoid large transient deps (>30KB gzip). Shared utilities MUST live
in an internal `@mouli.dev/forms-core` package to prevent duplication. Rendering MUST avoid unnecessary re-renders: use memo
and stable callbacks where measurable. p95 interactive latency <16ms on reference hardware; DOM depth kept minimal. Rationale:
Guarantees lean bundles suitable for large apps and keeps UI responsive.

## Architectural Constraints

1. Technology Stack: TypeScript, React 18+, Vite or tsx for builds/scripts, Vitest for tests, Storybook for docs, Pino for
structured logging in dev utilities. No class‑based React components—function components with hooks only.
2. Styling: Use CSS Modules or vanilla-extract (if added) with design tokens; avoid global leakage. Dark mode support REQUIRED
for all visual components.
3. State: Prefer controlled components; expose uncontrolled convenience where ergonomic. Internal state MUST be minimal and
documented.
4. Errors: Components MUST fail fast with descriptive errors in development and silent guards in production.
5. Accessibility Audit: Introduce automated a11y test (axe) per component; failing a11y gate blocks merge.

## Delivery Workflow

1. Specification: Each feature starts with a spec (user stories + acceptance scenarios) referencing principles above.
2. Plan: Implementation plan MUST list Constitution Check gates (a11y coverage, test plan, version impact analysis) before Phase 0.
3. Tasks: Tasks grouped by user story; test tasks precede implementation tasks and MUST initially fail.
4. Reviews: PR template MUST include checklist confirming: a11y compliance, test coverage, bundle size check, docs updated, versioning decision.
5. Release: Each release updates changelog, increments version per Principle 2, and runs full test + a11y + size audit.
6. Monitoring: Post‑release bundle diff validated; any regression triggers PATCH remediation within 48 hours.

## Governance

1. Authority: This constitution supersedes ad‑hoc practices; conflicts resolved in favor of written principles.
2. Amendment Procedure: Propose PR with: rationale, impact analysis (tests, docs, migration), version bump justification, and effective date.
3. Approval Threshold: At least one maintainer and one accessibility steward MUST approve amendments.
4. Versioning Policy: Apply semantic versioning as defined in Principle 2; record changes in `CHANGELOG.md`.
5. Compliance Reviews: Quarterly audit of random components for adherence (a11y, performance, API stability) with public report.
6. Enforcement: Non‑compliant PRs blocked until gates satisfied; emergency hotfixes allowed only for production breakages and must add tests within 24h.
7. Deferral: Any temporary violation MUST include an explicit TODO with owner + deadline ≤ 2 weeks.

**Version**: 1.0.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12
