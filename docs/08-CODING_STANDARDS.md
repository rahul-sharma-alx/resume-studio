# Resume Studio AI

Version: 1.0

Status: Approved

Owner: Alxpace

Last Updated: July 2026

---

# Coding Standards

## Purpose

This document defines the coding standards for Resume Studio AI.

Every engineer and AI coding agent must follow these rules.

These standards exist to ensure:

- Consistency
- Readability
- Maintainability
- Scalability
- Performance
- Type Safety

Code quality is more important than development speed.

---

# Engineering Philosophy

Write code for humans first.

Computers execute code.

Humans maintain it.

Every line should be easy to understand six months later.

---

# Core Principles

Prioritize

✓ Simplicity

✓ Readability

✓ Explicitness

✓ Predictability

✓ Testability

Avoid

✗ Clever code

✗ Hidden behavior

✗ Magic values

✗ Unnecessary abstraction

---

# Clean Code Rules

Every function should have one responsibility.

Every component should solve one problem.

Every file should have one clear purpose.

If a function requires extensive explanation,

it should probably be rewritten.

---

# TypeScript Rules

Strict mode is mandatory.

Never disable compiler rules.

Never use

```
any
```

Allowed

```
unknown
```

only when immediately narrowed.

Prefer

```
interface
```

for domain models.

Prefer

```
type
```

for unions and utility types.

---

# Null Safety

Never assume values exist.

Prefer

Optional chaining

Nullish coalescing

Explicit guards

Avoid

Non-null assertions (!)

unless absolutely guaranteed.

---

# Naming Rules

Names must describe intent.

Bad

```
data

temp

obj

value

item
```

Good

```
resume

experience

project

skillGroup

exportSettings
```

Long descriptive names are preferred over short ambiguous ones.

---

# File Naming

Components

```
ResumeEditor.tsx

ProjectCard.tsx

SkillGroup.tsx
```

Hooks

```
useResume.ts

useExport.ts

useAutoSave.ts
```

Utilities

```
formatDate.ts

calculateScore.ts

normalizeSkill.ts
```

Services

```
ResumeService.ts

PDFService.ts
```

---

# Folder Rules

Never place unrelated files together.

Every folder owns one responsibility.

Example

```
features/

resume/

components/

hooks/

services/

validators/

types/

utils/
```

Avoid dumping everything into one directory.

---

# Import Rules

Import order

1. React / Next

2. External libraries

3. Internal aliases

4. Relative imports

Example

```
react

next

zod

@/shared

@/features

./local
```

Never use deep relative imports.

Use aliases.

---

# Component Standards

Each component should

- Receive explicit props
- Avoid unnecessary state
- Be easily reusable
- Render predictable output

Target

100–200 lines

Maximum

250 lines

Split large components.

---

# Props

Prefer explicit props.

Avoid passing large objects unless necessary.

Good

```
title

subtitle

onSave
```

Bad

```
config

options

data
```

---

# State Management

Keep state as local as possible.

Use global state only for

Resume

Theme

History

Settings

Everything else remains local.

---

# Custom Hooks

Hooks contain behavior.

Components contain UI.

Example

```
useResume()

↓

returns

resume

saveResume()

deleteResume()
```

Hooks never render JSX.

---

# Service Layer

Business logic belongs inside services.

Never inside components.

Example

```
ResumeService

ExportService

ATSService

AIService
```

Services must be framework independent.

---

# Utility Functions

Utilities must be

Pure

Deterministic

Side-effect free

Bad

```
Reads localStorage

Updates DOM

Calls API
```

Good

```
formatDate()

calculateDuration()

normalizeSkill()
```

---

# Constants

Never hardcode

Limits

Regex

Colors

Routes

Labels

Magic numbers

Store inside constants.

---

# Enums

Prefer enums or union types.

Avoid raw strings.

Good

```
EmploymentType.FullTime
```

Bad

```
"Full Time"
```

---

# Validation

Every external input must be validated.

User Forms

Import

Storage

API

AI

Validation belongs in Zod schemas.

---

# Error Handling

Never swallow errors.

Every catch block must

Log

Recover

or

Rethrow

Empty catch blocks are forbidden.

---

# Async Code

Prefer

async/await

Avoid deeply nested Promise chains.

Always handle failures.

---

# Comments

Comments explain

Why

not

What

Bad

```
// increment i
```

Good

```
// Preserve original order for stable PDF rendering
```

If comments explain obvious code,

rewrite the code instead.

---

# End of Part 1

---

# React Standards

React components should be predictable.

Follow these priorities

Composition

↓

Custom Hooks

↓

Reusable Components

↓

Minimal Props

↓

Minimal State

Avoid inheritance.

Favor composition.

---

# Component Structure

Every component follows the same order.

Imports

↓

Types

↓

Constants

↓

Hooks

↓

Component

↓

Helper Functions

↓

Export

Never mix helper functions between JSX.

---

# JSX Rules

JSX should remain clean.

Avoid

Nested ternary operators

Nested map chains

Complex inline calculations

Move complex logic outside JSX.

---

# Conditional Rendering

Preferred

```
if

early return

guard clause
```

Allowed

```
&&
```

Avoid

Multiple nested ternaries.

---

# Lists

Every list must have

Stable keys.

Never use

Array index

unless the list is static.

Good

```
experience.id
```

Bad

```
index
```

---

# Performance Rules

Measure before optimizing.

Never optimize based on assumptions.

Avoid

Premature memoization

Deep prop drilling

Large Context providers

Repeated expensive calculations

Prefer

Granular state

Memoized selectors

Code splitting

Lazy loading

---

# Rendering Rules

Components should re-render only when necessary.

Changing one experience should never re-render the entire application.

Prefer smaller components over giant render trees.

---

# Accessibility Standards

Every interactive element must support

Keyboard navigation

Visible focus

Screen readers

Semantic HTML

Proper labels

Use

<button>

instead of clickable divs.

Use

<form>

instead of custom wrappers.

Use native elements whenever possible.

---

# Forms

Every form must include

Labels

Helper text

Validation

Accessible error messages

Keyboard submission

Placeholders never replace labels.

---

# Testing Standards

Every feature should include

Unit tests

Integration tests

End-to-end tests where appropriate.

Minimum unit coverage

80%

Critical workflows

100%

---

# Unit Testing

Test

Utilities

Services

Validation

Hooks

Avoid snapshot-heavy testing.

Prefer behavior-based assertions.

---

# Component Testing

Verify

Rendering

Interactions

Validation

Accessibility

Loading states

Error states

---

# End-to-End Testing

Critical flows

Create Resume

Edit Resume

Export PDF

Import Resume

Undo / Redo

Template Change

These flows must always work before release.

---

# Git Workflow

Main

Production-ready code only.

Develop

Integration branch.

Feature

One feature per branch.

Examples

```
feature/resume-editor

feature/pdf-export

feature/ats-engine
```

Never commit directly to main.

---

# Commit Messages

Use Conventional Commits.

Examples

```
feat: add resume export

fix: prevent duplicate skills

refactor: simplify preview rendering

docs: update architecture

test: add export service tests

perf: optimize resume preview
```

Avoid vague commits.

Bad

```
update

fix

changes

done
```

---

# Pull Request Checklist

Before opening a PR verify

✓ Builds successfully

✓ TypeScript passes

✓ ESLint passes

✓ Tests pass

✓ Responsive

✓ Accessible

✓ Documentation updated

✓ No unnecessary dependencies

✓ No console logs

✓ No TODOs without tracking

---

# Documentation Standards

Every exported function should have clear naming.

Public APIs should include documentation.

Complex business rules should reference the relevant design documents.

Documentation must stay synchronized with implementation.

---

# Logging Rules

Development

Detailed logs allowed.

Production

Log only operational events.

Never log

- Resume contents
- Personal information
- API keys
- Authentication tokens

---

# Security Standards

Validate all external input.

Escape dynamic HTML.

Sanitize imported documents.

Do not trust client-side validation alone.

Never expose secrets in client bundles.

---

# Dependency Rules

Before adding a dependency ask

Does the platform already provide this?

Can we implement it with existing utilities?

Is it actively maintained?

Does it increase bundle size significantly?

Prefer removing dependencies over adding them.

---

# Refactoring Guidelines

Refactor when

- Duplication appears
- Complexity increases
- Readability decreases
- Testing becomes difficult

Never refactor unrelated code inside feature branches.

Keep refactors focused.

---

# AI Coding Rules

AI-generated code must follow all project standards.

AI must never

- invent APIs
- invent database schemas
- invent business rules
- invent design decisions
- introduce undocumented dependencies
- disable TypeScript
- disable ESLint
- suppress errors without justification

If required information is missing,

AI should stop and request clarification instead of guessing.

---

# AI Implementation Order

Every feature should be built in this sequence

Requirements

↓

Domain Model

↓

Validation

↓

State

↓

Service

↓

UI

↓

Tests

↓

Documentation

Never implement UI before understanding the domain.

---

# Code Review Checklist

Reviewers should verify

Architecture consistency

Domain correctness

Naming quality

Accessibility

Performance

Security

Testing

Documentation

Maintainability

Reject code that violates project standards even if it functions correctly.

---

# Definition of Production Ready

A feature is production-ready only if

✓ Business requirements are complete

✓ Matches Domain Model

✓ Matches Design System

✓ Fully typed

✓ Accessible

✓ Responsive

✓ Tested

✓ Documented

✓ Performs well

✓ No critical lint issues

✓ No TypeScript errors

✓ No security concerns

✓ Ready for future extension

Anything less is considered incomplete.

---

# Engineering Principle

Every line of code should make the project

Simpler

Clearer

Safer

More maintainable

More scalable

If a solution is clever but difficult to understand,

choose the simpler solution.

Code is written once,

but read hundreds of times.

Optimize for the reader.

---

# End of Coding Standards