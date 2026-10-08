---
name: front-end-testing
description: Generate or refactor front-end tests for JDH components. USE WHEN the user creates a new component (main website in src/ rendered via index.html, or dashboard in src/dashboard/ rendered via dashboard.html), asks for a Storybook story, asks for a Vitest unit test, or asks to update/refactor an existing test or story after a component changed. Covers where to place the file, which tooling to use (Storybook vs Vitest), and conventions to follow.
---

# Front-end testing for JDH

This repo has **two front-ends** with two different testing conventions. Always determine which one applies before writing anything.

## 1. Decide which convention applies

| Signal                                                                                                   | Convention           |
| -------------------------------------------------------------------------------------------------------- | -------------------- |
| Component lives under `src/` and is part of the main site (entry `index.html`, e.g. `src/components/**`) | **Storybook story**  |
| Component lives under `src/dashboard/**` (entry `dashboard.html`)                                        | **Vitest unit test** |

If unsure, check the component's path: anything under `src/dashboard/` uses Vitest; everything else under `src/` (outside `src/dashboard/`) uses Storybook.

## 2. File placement (always colocated)

The test or story file **must live in the same directory as the component it covers**, never in a separate global folder.

- Main site component: `src/components/Foo/Foo.jsx` → story at `src/components/Foo/Foo.stories.tsx`
- Dashboard component: `src/dashboard/components/Foo/Foo.tsx` → spec at `src/dashboard/components/Foo/foo.spec.tsx`

Do not add new files to `src/stories/` — that folder holds legacy stories only and is not the convention going forward.

## 3. Main website components → Storybook story

Storybook is configured with the glob `src/**/*.stories.@(js|jsx|mjs|ts|tsx)` (see [.storybook/main.ts](../../../.storybook/main.ts)), so any colocated `*.stories.tsx` file is picked up automatically.

Story file conventions (match existing style, see [src/components/Milestone/Milestone.stories.tsx](../../../src/stories/ToC.stories.jsx) ):

```tsx
import { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import React from 'react'
import Foo from './Foo'

export meta:Meta {
  title: 'Components/Foo',
  component: Foo,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Story />
          </QueryParamProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    // one entry per prop, with control type and defaultValue
    className: { required: false, control: { type: 'text' }, defaultValue: '' },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    //default prop
  },
}

```

- `title` should follow `Components/<Name>` (or a sensible sub-group, e.g. `Components/Table of Contents/Default`).
- Add one exported story per meaningful state/variant (`Default`, plus others like `ActiveBelow`, `Disabled`, etc.), each with its own `.args`.
- Declare `args` for every prop the component accepts so Storybook controls work.
- Run `yarn storybook` to visually verify when relevant; do not run the full `build-storybook` unless asked.

## 4. Dashboard components → Vitest unit test

Config: [vitest.config.ts](../../../vitest.config.ts) — `jsdom` environment, globals enabled, setup file `src/dashboard/setupTests.ts`, includes `src/**/*.test.{ts,tsx}` and `src/**/*.spec.{ts,tsx}`.

Naming convention observed in the codebase: **lowercase-first** file name, e.g. `Button.tsx` → `button.spec.tsx`, `CustomBarChart.tsx` → `customBarChart.spec.tsx`.

Test file conventions (match existing style, see [src/dashboard/components/Buttons/Button/button.spec.tsx](../../../src/dashboard/components/Buttons/Button/button.spec.tsx) and [src/dashboard/components/CustomBarChart/customBarChart.spec.tsx](../../../src/dashboard/components/CustomBarChart/customBarChart.spec.tsx)):

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Foo from './Foo'

describe('Foo', () => {
  it('renders with given props', () => {
    render(<Foo /* ...props */ />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

Guidelines:

- Use `@testing-library/react` (`render`, `screen`, `fireEvent`) plus `vitest` (`describe`, `it`, `expect`, `vi`).
- Mock external dependencies with `vi.mock(...)`: API calls (`../../utils/api/api`), `react-i18next` (`useTranslation` returning `t: (key) => key`), heavy child components/chart libs (`@mui/x-charts/*`), and internal child components when their own behavior is out of scope.
- For components using `@tanstack/react-query`, wrap render in a `QueryClientProvider` with a fresh `QueryClient({ defaultOptions: { queries: { retry: false } } })`, and wrap in `Suspense` if the component suspends. Extract this into a local `renderComponent()` helper when reused across multiple `it` blocks.
- Cover: default render, prop-driven variations, user interactions (`fireEvent.click`, etc.), and conditional/error/loading states.
- Run tests with `yarn test` (or a scoped run, e.g. `yarn test src/dashboard/components/Foo`).

## 5. Refactoring an existing test/story after a component changes

When the user says a component changed and the test/story is stale:

1. Read the current component implementation and the existing test/story file side by side.
2. Identify what changed: new/removed/renamed props, new UI states, new interactions, new dependencies to mock, changed text/labels.
3. Update the existing file in place — do not create a duplicate file. Keep the existing describe/story structure and naming conventions used in that file.
4. Add new `it`/story-variant blocks for new behavior; remove ones that test behavior that no longer exists; update mocks (`vi.mock`) if imports changed.
5. For dashboard components, run `yarn test <path-to-spec>` afterward and fix any failures before considering the task done.
6. For Storybook stories, no automated run is required, but re-check `argTypes` and default `args` still match the component's prop signature.
