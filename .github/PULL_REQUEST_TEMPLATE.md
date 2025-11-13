# Pull Request

Please complete this checklist before requesting review. PRs that fail gates may be blocked until addressed.

## Summary

- Title:
- Type: feat | fix | docs | chore | refactor | perf | test
- Scope:
- Related Issue/Spec (if any):

## Checklist (Constitution Gates)

- [ ] Accessibility: All user-facing components meet WCAG 2.1 AA
  - [ ] Keyboard navigation and focus management covered
  - [ ] ARIA roles and labels verified
  - [ ] A11y tests (axe) added/updated and passing
- [ ] Testing: Tests written first and now passing
  - [ ] Unit tests cover critical logic and edge cases (>=90% overall)
  - [ ] Interaction tests added/updated
  - [ ] A11y tests added/updated
- [ ] Documentation: Stories + README updated
  - [ ] Storybook stories (primary, variants, a11y) added/updated
  - [ ] Prop tables and usage examples updated
  - [ ] Changelog entry prepared (see CHANGELOG.md)
- [ ] Performance/Bundle: Bundle size within budget and components tree-shakeable
  - [ ] No large transient deps (>30KB gzip) introduced without justification
  - [ ] Memoization/stable callbacks used where measurable
  - [ ] Size Limit check passing
- [ ] API Stability & SemVer
  - [ ] Public API change classified as MAJOR/MINOR/PATCH
  - [ ] Migration notes included for breaking changes
  - [ ] Deprecated API warnings added (if applicable)
- [ ] Governance
  - [ ] Constitution compliance validated
  - [ ] Any deferrals include explicit TODO(owner, deadline ≤ 2 weeks)

## Screenshots/Recordings (if visual)

[optional]

## Testing Notes

- How to run tests locally
- Any environment considerations

## Additional Notes

[optional]
