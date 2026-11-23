When performing a code review, respond in English.

When performing a code review, give your comments as simple as possible.

When performing a code review, focus on readability and avoid nested ternary operators.

When performing a code review, try to apply good practice in code as much as possible.

When performing a code review, reference the exact line and suggest a short fix.

When performing a code review, prefer early returns over deep nesting.

When performing a code review, check that functions are small and have a single responsibility.

When performing a code review, flag any use of `any` in TypeScript and suggest a proper type.

When performing a code review, check that React components are small, typed with explicit props, and do not mix data fetching with presentation.

When performing a code review, check that hooks follow the Rules of Hooks and that `useEffect` dependencies are complete and necessary.

When performing a code review, check that user-facing text uses `react-i18next` (`t()`) and is not hardcoded.

When performing a code review, check that Zustand stores are used for shared state only, with selectors to avoid unnecessary re-renders.

When performing a code review, check accessibility: semantic HTML, `alt` on images, accessible names on buttons and links, and keyboard support.

When performing a code review, flag `console.log`, commented-out code, and unused imports or variables.

When performing a code review, flag magic numbers and strings and suggest named constants.

When performing a code review, check that list items have stable `key` props.

When performing a code review, flag missing error and loading states for asynchronous data.

When performing a code review, check for security issues with unsanitized content, secrets in code, and unsafe URLs.

When performing a code review, check that new or changed components have a Storybook story, and that new logic has a Vitest test.

When performing a code review, check that names are descriptive: components in PascalCase, hooks prefixed with `use`, and booleans prefixed with `is`, `has`, or `should`.

When performing a code review, flag duplicated code and suggest extracting a shared component, hook, or util.

When performing a code review, suggest `useMemo`, `useCallback`, or `React.memo` only when there is a real performance problem, and flag premature use.

When performing a code review, check that imports use the project's path conventions and that there are no circular dependencies.

When performing a code review, check that unit tests or stories have been made for the new component according to the policy describe in `front-end-testing` skill.
